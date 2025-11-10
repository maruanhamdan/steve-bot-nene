// Dashboard System
let currentUser = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', () => {
    authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/dashboard/login.html';
        return;
    }
    
    loadUser();
    loadInvites();
    setupLogout();
});

async function loadUser() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            window.location.href = '/dashboard/login.html';
            return;
        }
        
        currentUser = await response.json();
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('tokensBadge').textContent = `${currentUser.tokens} Tokens`;
    } catch (error) {
        console.error('Error loading user:', error);
        window.location.href = '/dashboard/login.html';
    }
}

async function loadInvites() {
    try {
        const response = await fetch('/api/invites', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar convites');
        }
        
        const data = await response.json();
        renderInvites(data.invites);
        updateStats(data.invites);
    } catch (error) {
        console.error('Error loading invites:', error);
        document.getElementById('invitesList').innerHTML = `
            <p style="text-align: center; color: #f44336; padding: 40px;">
                Erro ao carregar convites. Tente novamente.
            </p>
        `;
    }
}

function renderInvites(invites) {
    const list = document.getElementById('invitesList');
    
    if (invites.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 60px; color: #666;">
                <h3 style="margin-bottom: 15px;">Nenhum convite criado ainda</h3>
                <p style="margin-bottom: 25px;">Crie seu primeiro convite interativo!</p>
                <button class="btn-create" onclick="window.location.href='/dashboard/create.html'">
                    + Criar Primeiro Convite
                </button>
            </div>
        `;
        return;
    }
    
    list.innerHTML = invites.map(invite => `
        <div class="invite-card" onclick="viewInvite('${invite.id}')">
            <div class="invite-card-header">
                <div>
                    <h3>${invite.childName}</h3>
                    <span class="age">${invite.age} anos</span>
                </div>
                <span class="invite-status status-${invite.status}">
                    ${invite.status === 'active' ? 'Ativo' : 'Rascunho'}
                </span>
            </div>
            <div class="invite-details">
                <div><strong>📅 Data:</strong> ${invite.date}</div>
                <div><strong>⏰ Horário:</strong> ${invite.time}</div>
                <div><strong>🎮 Jogo:</strong> ${invite.gameType === 'minerador' ? 'Minerador Pro' : 'Sequência Master'}</div>
                <div><strong>🎨 Tema:</strong> ${invite.theme}</div>
            </div>
            <div class="invite-actions">
                <button class="btn-action btn-view" onclick="event.stopPropagation(); viewInvite('${invite.id}')">
                    Ver
                </button>
                <button class="btn-action btn-share" onclick="event.stopPropagation(); shareInvite('${invite.id}')">
                    Compartilhar
                </button>
                <button class="btn-action btn-stats" onclick="event.stopPropagation(); viewStats('${invite.id}')">
                    Estatísticas
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats(invites) {
    document.getElementById('totalInvites').textContent = invites.length;
    document.getElementById('activeInvites').textContent = invites.filter(i => i.status === 'active').length;
    
    // TODO: Carregar RSVPs e calcular
    document.getElementById('totalRSVPs').textContent = '-';
    document.getElementById('confirmedRSVPs').textContent = '-';
}

function viewInvite(inviteId) {
    window.open(`/i/${inviteId}`, '_blank');
}

function shareInvite(inviteId) {
    const url = `${window.location.origin}/i/${inviteId}`;
    if (navigator.share) {
        navigator.share({
            title: 'Convite de Aniversário',
            text: 'Você foi convidado para uma festa!',
            url: url
        });
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copiado! Cole e compartilhe.');
        });
    }
}

function viewStats(inviteId) {
    // TODO: Abrir modal com estatísticas
    alert('Estatísticas em breve!');
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/dashboard/login.html';
    });
}

