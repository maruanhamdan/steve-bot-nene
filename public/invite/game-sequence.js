// 🎯 SEQUÊNCIA MASTER - Jogo de Memória com Pontuação
const COLORS = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let gameStartTime = null;
let gameTimer = null;
let gameComplete = false;
let isShowingSequence = false;
let playerName = '';
let selectedConfirmation = null;

// Inicializar
document.addEventListener('DOMContentLoaded', async () => {
    // Load invite data
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get('inviteId');
    
    if (inviteId) {
        await loadInviteData(inviteId);
    }
    
    // Pegar nome da URL ou localStorage
    playerName = urlParams.get('name') || localStorage.getItem('playerName') || '';
    
    if (playerName) {
        const nameInput = document.getElementById('childNameSequence');
        if (nameInput) nameInput.value = playerName;
    }
    
    setupColorButtons();
    loadLeaderboard();
    startNewLevel();
});

async function loadInviteData(inviteId) {
    try {
        const response = await fetch(`/api/invites/${inviteId}`);
        if (response.ok) {
            const data = await response.json();
            window.currentInvite = data.invite;
            renderInviteData(window.currentInvite);
        }
    } catch (error) {
        console.error('Error loading invite:', error);
    }
}

function renderInviteData(invite) {
    const childNameEl = document.querySelector('.invitation-card-sequence h3');
    if (childNameEl) childNameEl.textContent = invite.childName.toUpperCase();
    
    const ageEl = document.querySelector('.age-sequence');
    if (ageEl) ageEl.textContent = `${invite.age} ANOS`;
    
    const details = document.querySelectorAll('.party-info-sequence p');
    if (details.length >= 4) {
        if (details[0]) {
            const date = new Date(invite.date + 'T00:00:00');
            details[0].innerHTML = `<strong>📅 DATA:</strong> ${date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
        }
        if (details[1]) details[1].innerHTML = `<strong>⏰ HORÁRIO:</strong> ${invite.time}`;
        if (details[2]) details[2].innerHTML = `<strong>📍 LOCAL:</strong> ${invite.location.replace(/\n/g, '<br>')}`;
        if (details[3]) details[3].innerHTML = `<strong>🎮 TEMA:</strong> ${invite.theme.toUpperCase()}`;
    }
    
    window.currentInviteId = invite.id;
}

function setupColorButtons() {
    const buttons = document.querySelectorAll('.color-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isShowingSequence && !gameComplete) {
                handleColorClick(btn.dataset.color);
            }
        });
    });
}

function startNewLevel() {
    if (gameComplete) return;
    
    // Adicionar nova cor ALEATÓRIA à sequência
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    sequence.push(randomColor);
    
    playerSequence = [];
    isShowingSequence = true;
    
    // Desabilitar botões
    disableButtons();
    
    // Mostrar sequência
    showSequence();
}

function resetGame() {
    // Resetar tudo para jogar novamente
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    gameStartTime = null;
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    gameComplete = false;
    isShowingSequence = false;
    
    // Resetar UI
    document.getElementById('gameTimerSequence').textContent = '0s';
    document.getElementById('gameLevel').textContent = '1';
    document.getElementById('gameScoreSequence').textContent = '0';
    
    // Esconder convite
    const reveal = document.getElementById('invitationRevealSequence');
    if (reveal) {
        reveal.style.display = 'none';
    }
    
    // Mostrar elementos do jogo
    document.getElementById('colorGrid').style.display = 'grid';
    document.getElementById('sequenceDisplay').style.display = 'flex';
    document.getElementById('instructionsSequence').style.display = 'block';
    
    // Limpar display
    document.getElementById('sequenceDisplay').innerHTML = '';
    
    // Iniciar novo jogo
    startNewLevel();
}

function showSequence() {
    const display = document.getElementById('sequenceDisplay');
    display.innerHTML = '';
    
    // Mostrar TODA a sequência primeiro
    sequence.forEach((color, idx) => {
        const item = document.createElement('div');
        item.className = 'sequence-item';
        item.style.background = getColorValue(color);
        item.style.borderColor = '#fff';
        item.style.opacity = '0.5';
        display.appendChild(item);
    });
    
    // Depois animar cada item da sequência
    let index = 0;
    const showNext = () => {
        if (index >= sequence.length) {
            // Limpar display
            display.innerHTML = '';
            isShowingSequence = false;
            enableButtons();
            updateInstruction('Sua vez! Repita a sequência!');
            return;
        }
        
        const color = sequence[index];
        const items = display.querySelectorAll('.sequence-item');
        
        // Destacar o item atual
        if (items[index]) {
            items[index].classList.add('active');
            items[index].style.opacity = '1';
            playColorSound(color);
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            setTimeout(() => {
                items[index].classList.remove('active');
                items[index].style.opacity = '0.5';
            }, 600);
        }
        
        index++;
        setTimeout(showNext, 800);
    };
    
    updateInstruction(`Nível ${level} - Observe a sequência!`);
    setTimeout(showNext, 500); // Começar após 500ms
}

function handleColorClick(color) {
    if (isShowingSequence || gameComplete) return;
    
    // Iniciar timer no primeiro clique
    if (!gameStartTime) {
        gameStartTime = Date.now();
        startTimer();
    }
    
    playerSequence.push(color);
    
    // Feedback visual
    const btn = document.querySelector(`[data-color="${color}"]`);
    btn.classList.add('pressed');
    playColorSound(color);
    
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    setTimeout(() => {
        btn.classList.remove('pressed');
    }, 200);
    
    // Verificar se está correto
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        // Erro!
        gameOver();
        return;
    }
    
    // Se completou a sequência
    if (playerSequence.length === sequence.length) {
        // Nível completo!
        level++;
        score += level * 100;
        updateScore();
        
        // Celebrar
        playSuccessSound();
        showCelebration();
        
        // Próximo nível após delay
        setTimeout(() => {
            if (level <= 10) {
                startNewLevel();
            } else {
                // Completou todos os níveis!
                completeGame();
            }
        }, 1500);
    }
}

function gameOver() {
    gameComplete = true;
    if (gameTimer) clearInterval(gameTimer);
    
    playErrorSound();
    updateInstruction('Erro! Tente novamente!');
    
    setTimeout(() => {
        // Revelar convite mesmo com erro
        revealInvitation();
    }, 2000);
}

function completeGame() {
    gameComplete = true;
    if (gameTimer) clearInterval(gameTimer);
    
    // Calcular pontuação final
    const time = Math.floor((Date.now() - gameStartTime) / 1000);
    const timeBonus = Math.max(0, 5000 - (time * 10));
    score += timeBonus;
    updateScore();
    
    // Enviar pontuação
    submitScore();
    
    // Celebrar
    playVictorySound();
    showMegaCelebration();
    
    setTimeout(() => {
        revealInvitation();
    }, 2000);
}

function startTimer() {
    gameTimer = setInterval(() => {
        if (!gameComplete) {
            const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
            document.getElementById('gameTimerSequence').textContent = elapsed + 's';
        }
    }, 100);
}

function updateScore() {
    document.getElementById('gameScoreSequence').textContent = score.toLocaleString();
    document.getElementById('gameLevel').textContent = level;
}

function updateInstruction(text) {
    document.getElementById('instructionText').textContent = text;
}

function disableButtons() {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.add('disabled');
    });
}

function enableButtons() {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('disabled');
    });
}

function getColorValue(color) {
    const colors = {
        red: '#f44336',
        blue: '#2196F3',
        green: '#4CAF50',
        yellow: '#FFC107'
    };
    return colors[color] || '#fff';
}

function showCelebration() {
    const celebration = document.createElement('div');
    celebration.textContent = '🎉';
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    celebration.style.fontSize = '80px';
    celebration.style.zIndex = '10000';
    celebration.style.pointerEvents = 'none';
    celebration.style.animation = 'bounce 1s ease-out forwards';
    
    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 1000);
}

function showMegaCelebration() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => showCelebration(), i * 200);
    }
}

function revealInvitation() {
    const reveal = document.getElementById('invitationRevealSequence');
    reveal.style.display = 'block';
    
    // Adicionar botão de jogar novamente
    if (!document.getElementById('playAgainBtnSequence')) {
        const playAgainBtn = document.createElement('button');
        playAgainBtn.id = 'playAgainBtnSequence';
        playAgainBtn.className = 'play-again-btn-sequence';
        playAgainBtn.textContent = '🔄 JOGAR NOVAMENTE';
        playAgainBtn.onclick = resetGame;
        reveal.insertBefore(playAgainBtn, reveal.firstChild);
    }
    
    document.getElementById('colorGrid').style.display = 'none';
    document.getElementById('sequenceDisplay').style.display = 'none';
    document.getElementById('instructionsSequence').style.display = 'none';
    
    reveal.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard/sequencia?limit=5');
        const data = await response.json();
        
        if (data.scores && data.scores.length > 0) {
            const container = document.getElementById('leaderboardContainerSequence');
            const list = document.getElementById('leaderboardListSequence');
            list.innerHTML = '';
            
            data.scores.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item-sequence';
                item.innerHTML = `
                    <span style="color: #FFD700; font-weight: bold; min-width: 30px;">${index + 1}º</span>
                    <span style="flex: 1; text-align: left; margin: 0 10px;">${entry.playerName}</span>
                    <span style="color: #4CAF50; font-weight: bold;">${entry.score.toLocaleString()} pts</span>
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
        playerName = document.getElementById('childNameSequence')?.value.trim() || 'Jogador';
    }
    
    if (!gameStartTime) return;
    
    const time = Math.floor((Date.now() - gameStartTime) / 1000);
    const finalScore = score;
    
    try {
        const response = await fetch('/api/leaderboard/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gameType: 'sequencia',
                playerName: playerName,
                score: finalScore,
                time: time,
                blocks: level, // Usar nível como "blocos"
                timestamp: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        if (data.success) {
            const positionEl = document.createElement('div');
            positionEl.className = 'score-submitted';
            positionEl.style.cssText = 'margin-top: 10px; padding: 10px; background: rgba(76, 175, 80, 0.3); border: 2px solid #4CAF50; border-radius: 8px; font-size: 12px; color: #FFD700; text-shadow: 2px 2px 0px #000;';
            positionEl.innerHTML = `🏆 Você ficou em ${data.position}º lugar!`;
            document.querySelector('.game-stats-sequence').appendChild(positionEl);
            
            setTimeout(() => {
                loadLeaderboard();
            }, 1000);
        }
    } catch (error) {
        console.error('Erro ao enviar pontuação:', error);
    }
}

// Sons
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

function playColorSound(color) {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        const frequencies = {
            red: [440, 494],
            blue: [523, 587],
            green: [659, 698],
            yellow: [784, 880]
        };
        
        const freqs = frequencies[color] || [440];
        
        freqs.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const start = ctx.currentTime + (index * 0.05);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.3, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);
            osc.start(start);
            osc.stop(start + 0.2);
        });
    } catch (e) {
        console.log('Color sound');
    }
}

function playSuccessSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const start = ctx.currentTime + (index * 0.1);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.4, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    } catch (e) {
        console.log('Success sound');
    }
}

function playErrorSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.log('Error sound');
    }
}

function playVictorySound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const start = ctx.currentTime + (index * 0.1);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.5, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4);
            osc.start(start);
            osc.stop(start + 0.4);
        });
    } catch (e) {
        console.log('Victory sound');
    }
}

document.addEventListener('click', () => {
    initAudioContext();
}, { once: true });

// RSVP Form
document.addEventListener('DOMContentLoaded', () => {
    const confirmationBtns = document.querySelectorAll('.confirmation-btn-sequence');
    const rsvpForm = document.getElementById('rsvpFormSequenceElement');
    
    confirmationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.confirmation-btn-sequence').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');
            selectedConfirmation = btn.dataset.value;
            document.getElementById('confirmationSequence').value = selectedConfirmation;
            
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
            playColorSound('green');
        });
    });
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const childName = document.getElementById('childNameSequence').value.trim();
            if (childName) {
                localStorage.setItem('playerName', childName);
                playerName = childName;
            }
            
            const formData = {
                inviteId: window.currentInviteId || null,
                childName: childName,
                parentName: document.getElementById('parentNameSequence').value.trim(),
                whatsapp: document.getElementById('whatsappSequence').value.trim(),
                confirmation: document.getElementById('confirmationSequence').value,
                notes: null,
                timestamp: new Date().toISOString()
            };
            
            if (!formData.childName || !formData.parentName || !formData.whatsapp || !formData.confirmation) {
                const btn = document.getElementById('submitBtnSequence');
                btn.textContent = '⚠️ PREENCHA TUDO!';
                btn.style.background = '#f44336';
                setTimeout(() => {
                    btn.textContent = '🎉 ENVIAR';
                    btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)';
                }, 2000);
                return;
            }
            
            const submitBtn = document.getElementById('submitBtnSequence');
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ ENVIANDO...';
            
            try {
                const response = await fetch('/api/invite/rsvp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('rsvpFormSequenceElement').style.display = 'none';
                    document.getElementById('formSuccessSequence').style.display = 'block';
                    playVictorySound();
                    if (navigator.vibrate) {
                        navigator.vibrate([100, 50, 100]);
                    }
                } else {
                    throw new Error(data.error || 'Erro');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.disabled = false;
                submitBtn.textContent = '❌ TENTAR NOVAMENTE';
                setTimeout(() => {
                    submitBtn.textContent = '🎉 ENVIAR';
                }, 3000);
            }
        });
    }
    
    // Formatar WhatsApp
    const whatsappInput = document.getElementById('whatsappSequence');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
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
    }
});

