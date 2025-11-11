// Admin Dashboard JavaScript

const ADMIN_PASSWORD = 'heitor123'; // Should match server
let currentPassword = '';
let allRSVPs = [];
let filteredRSVPs = [];

// Expor variáveis globalmente para função inline
window.currentPassword = currentPassword;
window.allRSVPs = allRSVPs;

// Login - MELHORADO com debug
document.getElementById('loginBtn').addEventListener('click', () => {
    const password = document.getElementById('passwordInput').value.trim();
    console.log('Tentativa de login com senha:', password ? '***' : '(vazia)');
    console.log('Senha esperada:', ADMIN_PASSWORD);
    
    if (password === ADMIN_PASSWORD) {
        currentPassword = password;
        window.currentPassword = password; // Expor globalmente
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadRSVPs();
    } else {
        const errorEl = document.getElementById('loginError');
        errorEl.textContent = 'Senha incorreta! Use: ' + ADMIN_PASSWORD;
        errorEl.style.display = 'block';
        console.error('Login falhou. Senha digitada:', password, 'Esperada:', ADMIN_PASSWORD);
    }
});

// Enter key on password input
document.getElementById('passwordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('loginBtn').click();
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentPassword = '';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('passwordInput').value = '';
});

// Load RSVPs
async function loadRSVPs() {
    try {
        const response = await fetch(`/api/invite/rsvps?password=${encodeURIComponent(currentPassword)}`);
        const data = await response.json();
        
        if (response.ok) {
            allRSVPs = data.rsvps || [];
            window.allRSVPs = allRSVPs; // Expor globalmente
            filteredRSVPs = [...allRSVPs];
            updateStats();
            renderTable();
        } else {
            alert('Erro ao carregar RSVPs: ' + (data.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Error loading RSVPs:', error);
        alert('Erro ao carregar RSVPs. Verifique a conexão.');
    }
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(`/api/invite/stats?password=${encodeURIComponent(currentPassword)}`);
        const data = await response.json();
        
        if (response.ok) {
            updateStatsDisplay(data.stats);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Update statistics
function updateStats() {
    const stats = {
        total: allRSVPs.length,
        confirmed: allRSVPs.filter(r => r.confirmation === 'yes').length,
        declined: allRSVPs.filter(r => r.confirmation === 'no').length
    };
    
    updateStatsDisplay(stats);
}

function updateStatsDisplay(stats) {
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statConfirmed').textContent = stats.confirmed;
    document.getElementById('statDeclined').textContent = stats.declined;
}

// Render table
function renderTable() {
    const tbody = document.getElementById('rsvpTableBody');
    
    if (filteredRSVPs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Nenhum RSVP encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredRSVPs.map(rsvp => {
        const date = new Date(rsvp.timestamp);
        const dateStr = date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const confirmationClass = rsvp.confirmation === 'yes' ? 'yes' : 'no';
        const confirmationText = rsvp.confirmation === 'yes' ? '✅ Sim' : '❌ Não';
        
        return `
            <tr>
                <td>${dateStr}</td>
                <td>${escapeHtml(rsvp.childName)}</td>
                <td>${escapeHtml(rsvp.parentName)}</td>
                <td>${escapeHtml(rsvp.whatsapp)}</td>
                <td><span class="confirmation-badge ${confirmationClass}">${confirmationText}</span></td>
                <td>${rsvp.notes ? escapeHtml(rsvp.notes) : '-'}</td>
                <td>
                    <button class="action-btn" onclick="copyRSVP('${rsvp.id}')" title="Copiar">📋</button>
                    <button class="action-btn delete-btn" onclick="deleteRSVP('${rsvp.id}', ${JSON.stringify(rsvp.childName)})" title="Deletar">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter
        const filter = btn.dataset.filter;
        if (filter === 'all') {
            filteredRSVPs = [...allRSVPs];
        } else {
            filteredRSVPs = allRSVPs.filter(r => r.confirmation === filter);
        }
        
        // Apply search if any
        applySearch();
    });
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    applySearch();
});

function applySearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        // Just apply current filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        if (activeFilter === 'all') {
            filteredRSVPs = [...allRSVPs];
        } else {
            filteredRSVPs = allRSVPs.filter(r => r.confirmation === activeFilter);
        }
    } else {
        // Apply filter and search
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        let filtered = activeFilter === 'all' ? [...allRSVPs] : 
                       allRSVPs.filter(r => r.confirmation === activeFilter);
        
        filteredRSVPs = filtered.filter(r => 
            r.childName.toLowerCase().includes(searchTerm) ||
            r.parentName.toLowerCase().includes(searchTerm) ||
            r.whatsapp.includes(searchTerm)
        );
    }
    
    renderTable();
}

// Export to CSV
document.getElementById('exportBtn').addEventListener('click', () => {
    const headers = ['Data', 'Criança', 'Responsável', 'WhatsApp', 'Confirmação', 'Observações'];
    const rows = filteredRSVPs.map(rsvp => {
        const date = new Date(rsvp.timestamp);
        const dateStr = date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const confirmation = rsvp.confirmation === 'yes' ? 'Sim' : 'Não';
        
        return [
            dateStr,
            rsvp.childName,
            rsvp.parentName,
            rsvp.whatsapp,
            confirmation,
            rsvp.notes || ''
        ];
    });
    
    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rsvps-heitor-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
});

// Refresh
document.getElementById('refreshBtn').addEventListener('click', () => {
    loadRSVPs();
    loadStats();
});

// Copy RSVP info
function copyRSVP(id) {
    const rsvp = allRSVPs.find(r => r.id === id);
    if (!rsvp) return;
    
    const text = `Criança: ${rsvp.childName}\nResponsável: ${rsvp.parentName}\nWhatsApp: ${rsvp.whatsapp}\nConfirmação: ${rsvp.confirmation === 'yes' ? 'Sim' : 'Não'}\n${rsvp.notes ? `Observações: ${rsvp.notes}` : ''}`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('RSVP copiado para a área de transferência!');
    }).catch(() => {
        alert('Erro ao copiar. Informações:\n\n' + text);
    });
}

// Delete RSVP
async function deleteRSVP(id, childName) {
    // Confirmação antes de deletar
    const confirmed = confirm(`Tem certeza que deseja deletar o RSVP de "${childName}"?\n\nEsta ação não pode ser desfeita!`);
    
    if (!confirmed) {
        return;
    }
    
    try {
        const response = await fetch(`/api/invite/rsvp/${id}?password=${encodeURIComponent(currentPassword)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Remove do array local
            allRSVPs = allRSVPs.filter(r => r.id !== id);
            
            // Atualiza filtros e renderiza
            applySearch();
            loadStats();
            
            alert(`RSVP de "${childName}" deletado com sucesso!`);
        } else {
            alert(`Erro ao deletar RSVP: ${data.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Error deleting RSVP:', error);
        alert('Erro ao deletar RSVP. Tente novamente.');
    }
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-refresh every 30 seconds
setInterval(() => {
    if (currentPassword) {
        loadRSVPs();
        loadStats();
    }
}, 30000);
// Deploy: 1762873290

// Admin deploy verification 1762873181
// Final deploy 1762873397
console.log('Admin JS loaded: 1762873657');
