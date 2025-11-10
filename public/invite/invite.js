// Intro animation
window.addEventListener('load', () => {
    const intro = document.getElementById('intro');
    const main = document.getElementById('main');
    
    // Show intro for 2.5 seconds
    setTimeout(() => {
        intro.style.opacity = '0';
        intro.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            intro.style.display = 'none';
            main.style.display = 'flex';
            main.style.animation = 'fadeIn 0.5s ease-in';
        }, 500);
    }, 2500);
});

// Load invite data from API
let currentInvite = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check if inviteId is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get('inviteId');
    
    if (inviteId) {
        await loadInviteData(inviteId);
    } else {
        // Fallback to hardcoded data (compatibilidade)
        loadDefaultInvite();
    }
    
    setupGameButtons();
});

async function loadInviteData(inviteId) {
    try {
        const response = await fetch(`/api/invites/${inviteId}`);
        if (response.ok) {
            const data = await response.json();
            currentInvite = data.invite;
            renderInviteData(currentInvite);
        } else {
            loadDefaultInvite();
        }
    } catch (error) {
        console.error('Error loading invite:', error);
        loadDefaultInvite();
    }
}

function renderInviteData(invite) {
    // Update page title and meta
    document.title = `🎮 Convite ${invite.childName} - ${invite.theme}`;
    
    // Update main content
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) mainTitle.textContent = invite.childName.toUpperCase();
    
    const ageBadge = document.querySelector('.age-badge');
    if (ageBadge) ageBadge.textContent = `${invite.age} ANOS`;
    
    const partyInfo = document.querySelector('.party-info');
    if (partyInfo) {
        partyInfo.innerHTML = `
            <p class="info-text">Tema: <strong>${invite.theme.toUpperCase()}</strong></p>
            <p class="info-text">Data: <strong>${formatDate(invite.date)}</strong></p>
            <p class="info-text">Horário: <strong>${invite.time}</strong></p>
        `;
    }
    
    // Store inviteId for games
    window.currentInviteId = invite.id;
    window.currentInvite = invite;
}

function loadDefaultInvite() {
    // Default data (Heitor's party - compatibilidade)
    window.currentInvite = {
        id: null,
        childName: 'Heitor',
        age: 6,
        date: '2025-12-17',
        time: '19:00 às 22:00',
        location: 'Blue Moon - Av Oscarina Cunha Chaves, 112 - Copacabana, Uberlândia - MG',
        theme: 'Minecraft',
        gameType: 'minerador'
    };
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function setupGameButtons() {
    // Start game button
    document.getElementById('startGame')?.addEventListener('click', () => {
        const inviteId = window.currentInviteId || '';
        window.location.href = `/invite/game.html${inviteId ? '?inviteId=' + inviteId : ''}`;
    });

    // Start sequence game button
    document.getElementById('startGameSequence')?.addEventListener('click', () => {
        const inviteId = window.currentInviteId || '';
        window.location.href = `/invite/game-sequence.html${inviteId ? '?inviteId=' + inviteId : ''}`;
    });
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to blocks
    const blocks = document.querySelectorAll('.block');
    blocks.forEach(block => {
        block.addEventListener('click', () => {
            block.style.transform = 'scale(1.2)';
            setTimeout(() => {
                block.style.transform = '';
            }, 200);
        });
    });
});
