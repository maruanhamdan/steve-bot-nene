// Game Configuration
const GRID_SIZE = 5;
const TOTAL_BLOCKS = GRID_SIZE * GRID_SIZE;
// Random diamond position (different each time)
const DIAMOND_BLOCK_INDEX = Math.floor(Math.random() * TOTAL_BLOCKS);
let blocksMined = 0;
let gameComplete = false;

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

// Mine a block
function mineBlock(block, index) {
    if (block.classList.contains('mined') || gameComplete) return;
    
    // Add mined class with animation
    block.style.transition = 'all 0.2s ease-out';
    block.classList.add('mined');
    blocksMined++;
    
    // Play sound effect
    playSound('break');
    
    // Create particle effect
    createParticles(block);
    
    // Check if it's the diamond block
    if (block.dataset.isDiamond === 'true') {
        setTimeout(() => {
            revealDiamond(block);
        }, 300);
    }
    
    // Update progress
    updateProgress();
}

// Reveal diamond and invitation
function revealDiamond(block) {
    gameComplete = true;
    
    // Add diamond class
    block.classList.add('diamond');
    
    // Play celebration sound
    playSound('diamond');
    
    // Screen shake
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
    
    // Play success sound
    playSound('success');
    
    // Show invitation after delay
    setTimeout(() => {
        showInvitation();
    }, 1500);
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

// Create particle effects
function createParticles(block) {
    const rect = block.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / 5;
        const distance = 30 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Update progress bar
function updateProgress() {
    const progress = (blocksMined / TOTAL_BLOCKS) * 100;
    document.getElementById('progress').style.width = progress + '%';
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

// RSVP Form Handling
document.getElementById('rsvpFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        childName: document.getElementById('childName').value.trim(),
        parentName: document.getElementById('parentName').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        confirmation: document.getElementById('confirmation').value,
        notes: document.getElementById('notes').value.trim() || null,
        timestamp: new Date().toISOString()
    };
    
    // Validate
    if (!formData.childName || !formData.parentName || !formData.whatsapp || !formData.confirmation) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Disable form
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ ENVIANDO...';
    
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
            
            // Scroll to success message
            document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            throw new Error(data.error || 'Erro ao enviar confirmação');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erro ao enviar confirmação. Tente novamente!');
        submitBtn.disabled = false;
        submitBtn.textContent = '🎉 CONFIRMAR';
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
