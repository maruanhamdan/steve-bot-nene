// 🎮 JOGO MELHORADO - Aventura Minecraft
// Mecânicas, sons, visuais e gameplay completamente renovados

// Configuração
const GRID_SIZE = 3; // 3x3 = 9 blocos (mais fácil para crianças)
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
const ITEMS_TO_COLLECT = 8; // 8 itens + 1 diamante final
let itemsCollected = 0;
let diamondsFound = 0;
let gameComplete = false;
let selectedConfirmation = null;
let collectedItems = []; // Array para rastrear itens coletados

// Itens do Minecraft para coletar
const MINECRAFT_ITEMS = [
    { emoji: '⛏️', name: 'Picareta', sound: 'pickaxe', color: '#8B7355' },
    { emoji: '🪓', name: 'Machado', sound: 'axe', color: '#654321' },
    { emoji: '🗡️', name: 'Espada', sound: 'sword', color: '#C0C0C0' },
    { emoji: '🛡️', name: 'Escudo', sound: 'shield', color: '#4169E1' },
    { emoji: '🍎', name: 'Maçã', sound: 'apple', color: '#FF4500' },
    { emoji: '🥖', name: 'Pão', sound: 'bread', color: '#DEB887' },
    { emoji: '🔥', name: 'Tocha', sound: 'torch', color: '#FF8C00' },
    { emoji: '💎', name: 'Diamante', sound: 'diamond', color: '#00CED1' },
];

// Inicializar jogo
document.addEventListener('DOMContentLoaded', () => {
    createBlockGrid();
    updateProgress();
    initAudioContext();
    startBackgroundMusic();
});

// Criar grid de blocos
function createBlockGrid() {
    const grid = document.getElementById('blockGridNew');
    grid.innerHTML = '';
    
    // Criar array de índices e embaralhar
    const indices = Array.from({ length: TOTAL_BLOCKS }, (_, i) => i);
    shuffleArray(indices);
    
    // Distribuir itens
    const itemIndices = indices.slice(0, ITEMS_TO_COLLECT);
    const diamondIndex = indices[ITEMS_TO_COLLECT]; // Último item é sempre o diamante
    
    for (let i = 0; i < TOTAL_BLOCKS; i++) {
        const block = document.createElement('div');
        block.className = 'block-new';
        block.dataset.index = i;
        
        // Determinar conteúdo do bloco
        if (itemIndices.includes(i)) {
            const itemIndex = itemIndices.indexOf(i);
            block.dataset.itemType = 'item';
            block.dataset.itemIndex = itemIndex;
            block.dataset.emoji = MINECRAFT_ITEMS[itemIndex].emoji;
            block.dataset.itemName = MINECRAFT_ITEMS[itemIndex].name;
        } else if (i === diamondIndex) {
            block.dataset.itemType = 'diamond';
            block.dataset.emoji = '💎';
        } else {
            block.dataset.itemType = 'empty';
        }
        
        // Adicionar animação de entrada
        block.style.animationDelay = `${i * 0.05}s`;
        block.classList.add('block-enter');
        
        block.addEventListener('click', () => collectBlock(block, i));
        block.addEventListener('touchstart', (e) => {
            e.preventDefault();
            collectBlock(block, i);
        });
        
        grid.appendChild(block);
    }
}

// Embaralhar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Coletar bloco - MECÂNICA MELHORADA
function collectBlock(block, index) {
    if (block.classList.contains('collected') || gameComplete) return;
    
    const itemType = block.dataset.itemType;
    
    // Animação de coleta
    block.classList.add('collected');
    block.style.transform = 'scale(0.8) rotate(360deg)';
    
    // Feedback visual e sonoro baseado no tipo
    if (itemType === 'item') {
        const itemIndex = parseInt(block.dataset.itemIndex);
        const item = MINECRAFT_ITEMS[itemIndex];
        
        itemsCollected++;
        collectedItems.push(item);
        
        // Som específico do item
        playItemSound(item.sound);
        
        // Partículas coloridas
        createItemParticles(block, item.color, item.emoji);
        
        // Mostrar celebração
        showCelebration(item.emoji, `${item.name} Coletado!`);
        
        // Vibração
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
        
        // Atualizar UI
        updateProgress();
        
    } else if (itemType === 'diamond') {
        // DIAMANTE ENCONTRADO!
        diamondsFound++;
        gameComplete = true;
        
        // Som épico
        playDiamondSound();
        
        // Mega celebração visual
        createDiamondBurst(block);
        showCelebration('💎', 'DIAMANTE ENCONTRADO!');
        
        // Vibração intensa
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
        
        // Screen shake
        document.body.classList.add('shake-intense');
        setTimeout(() => {
            document.body.classList.remove('shake-intense');
        }, 1000);
        
        // Revelar convite após delay
        setTimeout(() => {
            revealInvitation();
        }, 1500);
        
    } else {
        // Bloco vazio
        playEmptySound();
        createEmptyParticles(block);
        
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }
    
    // Atualizar progresso
    updateProgress();
}

// Revelar convite
function revealInvitation() {
    document.getElementById('invitationRevealNew').style.display = 'block';
    document.getElementById('invitationRevealNew').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Esconder grid
    document.getElementById('blockGridNew').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    
    // Tocar som de sucesso final
    playSuccessSound();
}

// Atualizar progresso
function updateProgress() {
    const totalItems = ITEMS_TO_COLLECT + 1; // 8 itens + 1 diamante
    const collected = itemsCollected + diamondsFound;
    const progress = (collected / totalItems) * 100;
    
    document.getElementById('progressNew').style.width = progress + '%';
    document.getElementById('itemsCollected').textContent = itemsCollected;
    document.getElementById('diamondsFound').textContent = diamondsFound;
    
    // Mudar cor da barra baseado no progresso
    const progressBar = document.getElementById('progressNew');
    if (progress < 30) {
        progressBar.style.background = 'linear-gradient(90deg, #f44336 0%, #e57373 100%)';
    } else if (progress < 70) {
        progressBar.style.background = 'linear-gradient(90deg, #FFC107 0%, #FFD54F 100%)';
    } else if (progress < 100) {
        progressBar.style.background = 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, #00CED1 0%, #00FFFF 100%)';
        progressBar.style.boxShadow = '0 0 30px rgba(0, 206, 209, 0.8)';
    }
}

// Mostrar celebração
function showCelebration(emoji, text) {
    const overlay = document.getElementById('celebrationOverlay');
    const emojiEl = document.getElementById('celebrationEmoji');
    const textEl = document.getElementById('celebrationText');
    
    emojiEl.textContent = emoji;
    textEl.textContent = text;
    
    overlay.style.display = 'flex';
    overlay.classList.add('celebration-show');
    
    setTimeout(() => {
        overlay.classList.remove('celebration-show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }, 1500);
}

// Partículas para itens
function createItemParticles(element, color, emoji) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-item';
        particle.textContent = emoji;
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.zIndex = '10000';
        particle.style.fontSize = '24px';
        particle.style.pointerEvents = 'none';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 15;
        const distance = 80 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(0) rotate(720deg)`, 
                opacity: 0 
            }
        ], {
            duration: 1200,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Explosão de diamante
function createDiamondBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Múltiplas ondas de partículas
    for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle-diamond';
                particle.textContent = '💎';
                particle.style.position = 'fixed';
                particle.style.left = centerX + 'px';
                particle.style.top = centerY + 'px';
                particle.style.zIndex = '10000';
                particle.style.fontSize = `${20 + Math.random() * 15}px`;
                particle.style.pointerEvents = 'none';
                
                document.body.appendChild(particle);
                
                const angle = (Math.PI * 2 * i) / 30;
                const distance = 100 + Math.random() * 80;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.animate([
                    { 
                        transform: 'translate(0, 0) scale(1) rotate(0deg)', 
                        opacity: 1,
                        filter: 'brightness(1)'
                    },
                    { 
                        transform: `translate(${tx}px, ${ty}px) scale(0.5) rotate(1080deg)`, 
                        opacity: 0,
                        filter: 'brightness(2)'
                    }
                ], {
                    duration: 2000,
                    easing: 'ease-out'
                }).onfinish = () => particle.remove();
            }
        }, wave * 200);
    }
}

// Partículas para bloco vazio
function createEmptyParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.background = '#666';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.zIndex = '10000';
        particle.style.pointerEvents = 'none';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// ========== SISTEMA DE ÁUDIO MELHORADO ==========
let audioContext = null;
let backgroundOscillator = null;
let backgroundGain = null;

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

// Sons específicos para cada item
function playItemSound(itemType) {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        let frequencies = [];
        let duration = 0;
        let type = 'sine';
        
        switch(itemType) {
            case 'pickaxe':
                frequencies = [300, 350, 400];
                duration = 0.3;
                type = 'square';
                break;
            case 'axe':
                frequencies = [250, 300];
                duration = 0.25;
                type = 'sawtooth';
                break;
            case 'sword':
                frequencies = [400, 500, 600];
                duration = 0.2;
                type = 'triangle';
                break;
            case 'shield':
                frequencies = [200, 250, 300, 350];
                duration = 0.4;
                type = 'sine';
                break;
            case 'apple':
                frequencies = [523.25, 659.25];
                duration = 0.3;
                type = 'sine';
                break;
            case 'bread':
                frequencies = [392, 440];
                duration = 0.25;
                type = 'sine';
                break;
            case 'torch':
                frequencies = [600, 700, 800];
                duration = 0.35;
                type = 'sawtooth';
                break;
            case 'diamond':
                frequencies = [523.25, 659.25, 783.99];
                duration = 0.4;
                type = 'sine';
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
            oscillator.type = type;
            
            const startTime = ctx.currentTime + (index * 0.05);
            const volume = 0.25;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    } catch (e) {
        console.log('Sound:', itemType);
    }
}

// Som épico para diamante
function playDiamondSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Sequência de notas ascendentes (escala maior)
        const notes = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C, E, G, B, D
        
        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            const startTime = ctx.currentTime + (index * 0.1);
            const duration = 0.3;
            const volume = 0.4;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    } catch (e) {
        console.log('Diamond sound');
    }
}

// Som para bloco vazio
function playEmptySound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 150;
        oscillator.type = 'sawtooth';
        
        const duration = 0.15;
        const volume = 0.15;
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Empty sound');
    }
}

// Som de sucesso final
function playSuccessSound() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        // Fanfarra de sucesso
        const fanfare = [
            { freq: 523.25, time: 0 },
            { freq: 659.25, time: 0.1 },
            { freq: 783.99, time: 0.2 },
            { freq: 987.77, time: 0.3 },
            { freq: 1174.66, time: 0.4 },
            { freq: 1318.51, time: 0.5 },
        ];
        
        fanfare.forEach((note) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.frequency.value = note.freq;
            oscillator.type = 'sine';
            
            const startTime = ctx.currentTime + note.time;
            const duration = 0.4;
            const volume = 0.3;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    } catch (e) {
        console.log('Success sound');
    }
}

// Música de fundo suave
function startBackgroundMusic() {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    // Música será iniciada apenas após interação do usuário
    document.addEventListener('click', () => {
        if (!backgroundOscillator) {
            try {
                backgroundOscillator = ctx.createOscillator();
                backgroundGain = ctx.createGain();
                
                backgroundOscillator.connect(backgroundGain);
                backgroundGain.connect(ctx.destination);
                
                backgroundOscillator.frequency.value = 220; // Lá
                backgroundOscillator.type = 'sine';
                
                backgroundGain.gain.value = 0.05; // Muito baixo
                
                backgroundOscillator.start();
            } catch (e) {
                // Ignorar erro
            }
        }
    }, { once: true });
}

// Ativar áudio no primeiro clique
document.addEventListener('click', () => {
    initAudioContext();
}, { once: true });

// ========== FORMULÁRIO RSVP ==========
document.querySelectorAll('.confirmation-btn-new').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.confirmation-btn-new').forEach(b => {
            b.classList.remove('selected');
        });
        btn.classList.add('selected');
        selectedConfirmation = btn.dataset.value;
        document.getElementById('confirmationNew').value = selectedConfirmation;
        
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        playItemSound('pickaxe');
    });
});

document.getElementById('rsvpFormNewElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        childName: document.getElementById('childNameNew').value.trim(),
        parentName: document.getElementById('parentNameNew').value.trim(),
        whatsapp: document.getElementById('whatsappNew').value.trim(),
        confirmation: document.getElementById('confirmationNew').value,
        notes: null,
        timestamp: new Date().toISOString()
    };
    
    if (!formData.childName || !formData.parentName || !formData.whatsapp || !formData.confirmation) {
        const btn = document.getElementById('submitBtnNew');
        btn.innerHTML = '<span class="btn-emoji-new">⚠️</span><span class="btn-text-new">PREENCHA TUDO!</span>';
        btn.style.background = '#f44336';
        setTimeout(() => {
            btn.innerHTML = '<span class="btn-emoji-new">🎉</span><span class="btn-text-new">ENVIAR</span>';
            btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)';
        }, 2000);
        return;
    }
    
    const submitBtn = document.getElementById('submitBtnNew');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-emoji-new">⏳</span><span class="btn-text-new">ENVIANDO...</span>';
    
    try {
        const response = await fetch('/api/invite/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('rsvpFormNewElement').style.display = 'none';
            document.getElementById('formSuccessNew').style.display = 'block';
            playSuccessSound();
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        } else {
            throw new Error(data.error || 'Erro');
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-emoji-new">❌</span><span class="btn-text-new">TENTAR NOVAMENTE</span>';
        setTimeout(() => {
            submitBtn.innerHTML = '<span class="btn-emoji-new">🎉</span><span class="btn-text-new">ENVIAR</span>';
        }, 3000);
    }
});

// Formatar WhatsApp
document.getElementById('whatsappNew').addEventListener('input', (e) => {
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

