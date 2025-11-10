// Game Configuration - MELHORADO
const GRID_SIZE = 4; // Reduzido de 5 para 4 (mais fácil)
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
// Diamond sempre em posição fixa para facilitar (último bloco)
const DIAMOND_BLOCK_INDEX = TOTAL_BLOCKS - 1; // Último bloco sempre tem o diamante
let blocksMined = 0;
let gameComplete = false;
let selectedConfirmation = null; // Para o formulário simplificado

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    createBlockGrid();
    updateProgress();
});

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
    
    // Play sound effect (mais variado)
    playSound('break');
    
    // Create MORE particles (mais visual)
    createParticles(block, 8); // Aumentado de 5 para 8
    
    // Haptic feedback (se disponível)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Check if it's the diamond block
    if (block.dataset.isDiamond === 'true') {
        setTimeout(() => {
            revealDiamond(block);
        }, 200); // Mais rápido
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
    
    // Add diamond class
    block.classList.add('diamond');
    
    // Play celebration sound
    playSound('diamond');
    
    // Screen shake mais intenso
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 600);
    
    // Play success sound
    playSound('success');
    
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
    
    // Show invitation after delay (mais rápido)
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

function playSound(type) {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        let frequencies = [];
        let duration = 0;
        let oscillatorType = 'square';
        
        switch(type) {
            case 'break':
                // Minecraft block break sound - multiple frequencies
                frequencies = [150, 200, 250];
                duration = 0.15;
                oscillatorType = 'square';
                break;
            case 'diamond':
                // Celebration sound - ascending notes
                frequencies = [523.25, 659.25, 783.99, 987.77]; // C, E, G, B
                duration = 0.6;
                oscillatorType = 'sine';
                break;
            case 'success':
                // Success sound
                frequencies = [440, 554.37, 659.25]; // A, C#, E
                duration = 0.4;
                oscillatorType = 'sine';
                break;
            default:
                frequencies = [400];
                duration = 0.2;
        }
        
        // Play all frequencies
        frequencies.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = oscillatorType;
            
            const startTime = ctx.currentTime + (index * 0.05);
            const volume = type === 'diamond' ? 0.4 : 0.3;
            
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
    
    const formData = {
        childName: document.getElementById('childName').value.trim(),
        parentName: document.getElementById('parentName').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        confirmation: document.getElementById('confirmation').value,
        notes: null, // Removido campo de observações
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
