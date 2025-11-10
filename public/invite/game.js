// ⛏️ MINERADOR PRO - Jogo com Pontuação e Leaderboard
const GRID_SIZE = 4;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const DIAMOND_BLOCK_INDEX = TOTAL_BLOCKS - 1;
let blocksMined = 0;
let gameComplete = false;
let selectedConfirmation = null;
let gameStartTime = null;
let gameTimer = null;
let playerName = '';

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    // Pegar nome da URL ou localStorage
    const urlParams = new URLSearchParams(window.location.search);
    playerName = urlParams.get('name') || localStorage.getItem('playerName') || '';
    
    if (playerName) {
        const nameInput = document.getElementById('childName');
        if (nameInput) nameInput.value = playerName;
    }
    
    createBlockGrid();
    updateProgress();
    loadLeaderboard();
    
    // Iniciar timer quando primeiro bloco for clicado
    document.getElementById('blockGrid').addEventListener('click', startTimer, { once: true });
});

function startTimer() {
    gameStartTime = Date.now();
    gameTimer = setInterval(() => {
        if (!gameComplete) {
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
            document.getElementById('gameTimer').textContent = elapsed + 's';
            updateScore();
        }
    }, 100);
}

function updateScore() {
    if (!gameStartTime) return;
    const time = Math.floor((Date.now() - gameStartTime) / 1000);
    const timeBonus = Math.max(0, 10000 - (time * 50)); // Bônus por velocidade
    const blocksPenalty = blocksMined * 10; // Penalidade por blocos
    const score = Math.max(0, timeBonus - blocksPenalty + 1000); // Base score
    
    document.getElementById('gameScore').textContent = score.toLocaleString();
    document.getElementById('blocksCount').textContent = blocksMined;
}

async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard/minerador?limit=5');
        const data = await response.json();
        
        if (data.scores && data.scores.length > 0) {
            const container = document.getElementById('leaderboardContainer');
            const list = document.getElementById('leaderboardList');
            list.innerHTML = '';
            
            data.scores.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = `
                    <span class="rank">${index + 1}º</span>
                    <span class="name">${entry.playerName}</span>
                    <span class="score">${entry.score.toLocaleString()} pts</span>
                `;
                list.appendChild(item);
            });
            
            container.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar leaderboard:', error);
    }
}

async function submitScore() {
    if (!playerName) {
        playerName = document.getElementById('childName')?.value.trim() || 'Jogador';
    }
    
    if (!gameStartTime) return;
    
    const time = Math.floor((Date.now() - gameStartTime) / 1000);
    const timeBonus = Math.max(0, 10000 - (time * 50));
    const blocksPenalty = blocksMined * 10;
    const score = Math.max(0, timeBonus - blocksPenalty + 1000);
    
    try {
        const response = await fetch('/api/leaderboard/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gameType: 'minerador',
                playerName: playerName,
                score: score,
                time: time,
                blocks: blocksMined,
                timestamp: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        if (data.success) {
            // Mostrar posição no ranking
            const positionEl = document.createElement('div');
            positionEl.className = 'score-submitted';
            positionEl.innerHTML = `🏆 Você ficou em ${data.position}º lugar!`;
            document.querySelector('.game-header').appendChild(positionEl);
            
            setTimeout(() => {
                loadLeaderboard();
            }, 1000);
        }
    } catch (error) {
        console.error('Erro ao enviar pontuação:', error);
    }
}

// Create block grid
function createBlockGrid() {
    const grid = document.getElementById('blockGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
        const block = document.createElement('div');
        block.className = 'block';
        block.dataset.index = i;
        block.dataset.isDiamond = i === DIAMOND_BLOCK_INDEX;
        
        block.addEventListener('click', () => mineBlock(block, i));
        block.addEventListener('touchstart', (e) => {
            e.preventDefault();
            mineBlock(block, i);
        });
        
        grid.appendChild(block);
    }
}

// Mine a block - MELHORADO com mais feedback
function mineBlock(block, index) {
    if (block.classList.contains('mined') || gameComplete) return;
    
    // Add mined class with animation
    block.style.transition = 'all 0.15s ease-out';
    block.classList.add('mined');
    blocksMined++;
    
    // Play sound effect melhorado (quebra de bloco + picareta)
    playMiningSound();
    
    // Create MORE particles (mais visual)
    createParticles(block, 8);
    
    // Haptic feedback (se disponível)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Atualizar pontuação
    updateScore();
    
    // Check if it's the diamond block
    if (block.dataset.isDiamond === 'true') {
        setTimeout(() => {
            revealDiamond(block);
        }, 200);
    }
    
    // Update progress with animation
    updateProgress();
    
    // Show mini celebration every 4 blocks
    if (blocksMined % 4 === 0 && !gameComplete) {
        showMiniCelebration();
    }
}

// Reveal diamond and invitation - MELHORADO
function revealDiamond(block) {
    gameComplete = true;
    
    // Parar timer
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    // Add diamond class
    block.classList.add('diamond');
    
    // Play som épico de descoberta de diamante
    playDiamondDiscoverySound();
    
    // Screen shake mais intenso
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 600);
    
    // MEGA celebração visual
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticles(block, 12);
        }, i * 50);
    }
    
    // Haptic feedback intenso
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Enviar pontuação
    submitScore();
    
    // Show invitation after delay
    setTimeout(() => {
        showInvitation();
    }, 1000);
}

// Show invitation reveal
function showInvitation() {
    const reveal = document.getElementById('invitationReveal');
    const grid = document.getElementById('blockGrid');
    
    // Hide grid with animation
    grid.style.opacity = '0';
    grid.style.transform = 'scale(0.8)';
    grid.style.transition = 'all 0.5s ease-out';
    
    setTimeout(() => {
        grid.style.display = 'none';
        reveal.style.display = 'block';
        
        // Scroll to reveal
        reveal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
}

// Create particle effects - MELHORADO
function createParticles(block, count = 8) {
    const rect = block.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / count;
        const distance = 40 + Math.random() * 30; // Mais distância
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        // Cores variadas
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (8 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1200);
    }
}

// Mini celebração durante o jogo
function showMiniCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'mini-celebration';
    celebration.textContent = '🎉';
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    celebration.style.fontSize = '60px';
    celebration.style.zIndex = '10000';
    celebration.style.pointerEvents = 'none';
    celebration.style.animation = 'miniCelebration 1s ease-out forwards';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 1000);
}

// Update progress bar - MELHORADO com animação
function updateProgress() {
    const progress = (blocksMined / TOTAL_BLOCKS) * 100;
    const progressBar = document.getElementById('progress');
    
    // Animação suave
    progressBar.style.transition = 'width 0.3s ease-out';
    progressBar.style.width = progress + '%';
    
    // Mudança de cor conforme progresso
    if (progress < 33) {
        progressBar.style.background = 'linear-gradient(90deg, #f44336 0%, #e57373 100%)';
    } else if (progress < 66) {
        progressBar.style.background = 'linear-gradient(90deg, #FFC107 0%, #FFD54F 100%)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)';
    }
    
    // Efeito de brilho quando próximo do fim
    if (progress > 80) {
        progressBar.style.boxShadow = '0 0 20px #4CAF50, 0 0 40px #4CAF50';
    }
}

// Enhanced Minecraft-style sound effects
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio context not available');
        }
    }
    return audioContext;
}

// Som melhorado de mineração (quebra de bloco + picareta)
function playMiningSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Som de picareta batendo no bloco
        const pickaxeFreqs = [200, 250, 300];
        const blockBreakFreqs = [150, 180, 220];
        
        // Picareta
        pickaxeFreqs.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'square';
            
            const start = ctx.currentTime + (index * 0.02);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.25, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.1);
            osc.start(start);
            osc.stop(start + 0.1);
        });
        
        // Quebra do bloco (ligeiramente depois)
        setTimeout(() => {
            blockBreakFreqs.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sawtooth';
                
                const start = ctx.currentTime + (index * 0.01);
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
                osc.start(start);
                osc.stop(start + 0.15);
            });
        }, 50);
        
    } catch (e) {
        console.log('Mining sound');
    }
}

// Som épico de descoberta de diamante
function playDiamondDiscoverySound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Sequência épica: notas ascendentes + brilho
        const notes = [
            { freq: 523.25, time: 0 },    // C
            { freq: 659.25, time: 0.1 },  // E
            { freq: 783.99, time: 0.2 },  // G
            { freq: 987.77, time: 0.3 },  // B
            { freq: 1174.66, time: 0.4 }, // D (alta)
            { freq: 1318.51, time: 0.5 }  // E (alta)
        ];
        
        notes.forEach((note) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = note.freq;
            osc.type = 'sine';
            
            const start = ctx.currentTime + note.time;
            const duration = 0.4;
            const volume = 0.5;
            
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(volume, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
            osc.start(start);
            osc.stop(start + duration);
        });
        
        // Efeito de "brilho" (ruído branco filtrado)
        setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.value = 800;
            filter.type = 'bandpass';
            filter.frequency.value = 2000;
            filter.Q.value = 1;
            
            const start = ctx.currentTime;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.3, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
            osc.start(start);
            osc.stop(start + 0.3);
        }, 200);
        
    } catch (e) {
        console.log('Diamond discovery sound');
    }
}

function playSound(type) {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        let frequencies = [];
        let duration = 0;
        let oscillatorType = 'sine';
        
        switch(type) {
            case 'success':
                frequencies = [440, 554.37, 659.25];
                duration = 0.4;
                oscillatorType = 'sine';
                break;
            default:
                frequencies = [400];
                duration = 0.2;
        }
        
        frequencies.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = oscillatorType;
            
            const startTime = ctx.currentTime + (index * 0.05);
            const volume = 0.3;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
        
    } catch (e) {
        console.log('Sound effect:', type);
    }
}

// Initialize audio context on first user interaction
document.addEventListener('click', () => {
    initAudioContext();
}, { once: true });

// RSVP Form Handling - SIMPLIFICADO
// Botões de confirmação
document.querySelectorAll('.confirmation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove seleção anterior
        document.querySelectorAll('.confirmation-btn').forEach(b => {
            b.classList.remove('selected');
        });
        
        // Seleciona atual
        btn.classList.add('selected');
        selectedConfirmation = btn.dataset.value;
        document.getElementById('confirmation').value = selectedConfirmation;
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        
        // Sound
        playSound('success');
    });
});

// Submit form
document.getElementById('rsvpFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const childNameInput = document.getElementById('childName');
    const childName = childNameInput.value.trim();
    
    // Salvar nome para próximas vezes
    if (childName) {
        localStorage.setItem('playerName', childName);
        playerName = childName;
    }
    
    const formData = {
        childName: childName,
        parentName: document.getElementById('parentName').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        confirmation: document.getElementById('confirmation').value,
        notes: null,
        timestamp: new Date().toISOString()
    };
    
    // Validate
    if (!formData.childName || !formData.parentName || !formData.whatsapp || !formData.confirmation) {
        // Visual feedback ao invés de alert
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('shake');
        submitBtn.innerHTML = '<span class="btn-emoji-large">⚠️</span><span class="btn-text-large">PREENCHA TUDO!</span>';
        setTimeout(() => {
            submitBtn.classList.remove('shake');
            submitBtn.innerHTML = '<span class="btn-emoji-large">🎉</span><span class="btn-text-large">ENVIAR</span>';
        }, 2000);
        return;
    }
    
    // Disable form
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-emoji-large">⏳</span><span class="btn-text-large">ENVIANDO...</span>';
    
    try {
        const response = await fetch('/api/invite/rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message
            document.getElementById('rsvpFormElement').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // Play celebration sound
            playSound('diamond');
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            
            // Scroll to success message
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error(data.error || 'Erro ao enviar confirmação');
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-emoji-large">❌</span><span class="btn-text-large">TENTAR NOVAMENTE</span>';
        setTimeout(() => {
            submitBtn.innerHTML = '<span class="btn-emoji-large">🎉</span><span class="btn-text-large">ENVIAR</span>';
        }, 3000);
    }
});

// Format WhatsApp input
document.getElementById('whatsapp').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 2) {
            value = `(${value}`;
        } else if (value.length <= 7) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }
    }
    e.target.value = value;
});
