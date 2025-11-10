// Jogo Super Simples - Tap Rápido
let tapCount = 0;
const TAPS_NEEDED = 10;
let gameComplete = false;
let selectedConfirmation = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    
    // Tap no bloco grande
    const bigBlock = document.getElementById('bigBlock');
    bigBlock.addEventListener('click', tapBlock);
    bigBlock.addEventListener('touchstart', (e) => {
        e.preventDefault();
        tapBlock();
    });
});

// Tap no bloco
function tapBlock() {
    if (gameComplete) return;
    
    tapCount++;
    
    // Animação
    const bigBlock = document.getElementById('bigBlock');
    bigBlock.classList.add('tapped');
    setTimeout(() => {
        bigBlock.classList.remove('tapped');
    }, 300);
    
    // Som
    playSound('break');
    
    // Vibração
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    // Partículas
    createParticlesSimple(bigBlock);
    
    // Atualizar progresso
    updateProgress();
    
    // Verificar se completou
    if (tapCount >= TAPS_NEEDED) {
        setTimeout(() => {
            revealInvitation();
        }, 500);
    }
}

// Atualizar progresso
function updateProgress() {
    const progress = (tapCount / TAPS_NEEDED) * 100;
    document.getElementById('progressSimple').style.width = progress + '%';
    document.getElementById('progressText').textContent = `${tapCount} / ${TAPS_NEEDED}`;
    
    // Mudar cor
    if (progress < 50) {
        document.getElementById('progressSimple').style.background = 'linear-gradient(90deg, #f44336 0%, #e57373 100%)';
    } else if (progress < 80) {
        document.getElementById('progressSimple').style.background = 'linear-gradient(90deg, #FFC107 0%, #FFD54F 100%)';
    } else {
        document.getElementById('progressSimple').style.background = 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)';
    }
}

// Revelar convite
function revealInvitation() {
    gameComplete = true;
    
    // MEGA celebração
    playSound('diamond');
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Esconder bloco
    document.getElementById('bigBlock').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    document.querySelector('.instruction').style.display = 'none';
    
    // Mostrar convite
    document.getElementById('invitationRevealSimple').style.display = 'block';
    document.getElementById('invitationRevealSimple').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Partículas simples
function createParticlesSimple(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '12px';
        particle.style.height = '12px';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (Math.PI * 2 * i) / 10;
        const distance = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
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

function playSound(type) {
    const ctx = initAudioContext();
    if (!ctx) return;
    
    try {
        let frequencies = [];
        let duration = 0;
        
        switch(type) {
            case 'break':
                frequencies = [200, 250, 300];
                duration = 0.2;
                break;
            case 'diamond':
                frequencies = [523.25, 659.25, 783.99, 987.77];
                duration = 0.6;
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
            oscillator.type = 'sine';
            
            const startTime = ctx.currentTime + (index * 0.05);
            const volume = type === 'diamond' ? 0.4 : 0.3;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    } catch (e) {
        console.log('Sound:', type);
    }
}

document.addEventListener('click', () => {
    initAudioContext();
}, { once: true });

// RSVP Form
document.querySelectorAll('.confirmation-btn-simple').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.confirmation-btn-simple').forEach(b => {
            b.classList.remove('selected');
        });
        btn.classList.add('selected');
        selectedConfirmation = btn.dataset.value;
        document.getElementById('confirmationSimple').value = selectedConfirmation;
        
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
        playSound('break');
    });
});

document.getElementById('rsvpFormSimpleElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        childName: document.getElementById('childNameSimple').value.trim(),
        parentName: document.getElementById('parentNameSimple').value.trim(),
        whatsapp: document.getElementById('whatsappSimple').value.trim(),
        confirmation: document.getElementById('confirmationSimple').value,
        notes: null,
        timestamp: new Date().toISOString()
    };
    
    if (!formData.childName || !formData.parentName || !formData.whatsapp || !formData.confirmation) {
        const btn = document.getElementById('submitBtnSimple');
        btn.textContent = '⚠️ PREENCHA TUDO!';
        btn.style.background = '#f44336';
        setTimeout(() => {
            btn.textContent = '🎉 ENVIAR';
            btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)';
        }, 2000);
        return;
    }
    
    const submitBtn = document.getElementById('submitBtnSimple');
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
            document.getElementById('rsvpFormSimpleElement').style.display = 'none';
            document.getElementById('formSuccessSimple').style.display = 'block';
            playSound('diamond');
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

// Format WhatsApp
document.getElementById('whatsappSimple').addEventListener('input', (e) => {
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

