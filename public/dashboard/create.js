// Create Invite Wizard
let currentStep = 1;
let selectedGame = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', () => {
    authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = '/dashboard/login.html';
        return;
    }
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
});

function nextStep() {
    if (currentStep === 1) {
        // Validate step 1
        const childName = document.getElementById('childName').value.trim();
        const age = document.getElementById('age').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value.trim();
        const location = document.getElementById('location').value.trim();
        const theme = document.getElementById('theme').value.trim();
        
        if (!childName || !age || !date || !time || !location || !theme) {
            alert('Preencha todos os campos');
            return;
        }
        
        currentStep = 2;
        showStep(2);
    } else if (currentStep === 2) {
        // Validate step 2
        if (!selectedGame) {
            document.getElementById('gameError').style.display = 'block';
            return;
        }
        
        updatePreview();
        currentStep = 3;
        showStep(3);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    document.querySelectorAll('.wizard-step').forEach((s, i) => {
        s.classList.toggle('active', i + 1 === step);
    });
}

function selectGame(gameType) {
    selectedGame = gameType;
    document.getElementById('gameType').value = gameType;
    document.getElementById('gameError').style.display = 'none';
    
    // Visual feedback
    document.querySelectorAll('.game-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector(`[data-game="${gameType}"]`).classList.add('selected');
}

function updatePreview() {
    document.getElementById('previewChildName').textContent = document.getElementById('childName').value;
    document.getElementById('previewAge').textContent = document.getElementById('age').value + ' anos';
    
    const date = new Date(document.getElementById('date').value);
    document.getElementById('previewDate').textContent = date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    document.getElementById('previewTime').textContent = document.getElementById('time').value;
    document.getElementById('previewLocation').textContent = document.getElementById('location').value;
    document.getElementById('previewTheme').textContent = document.getElementById('theme').value;
    document.getElementById('previewGame').textContent = selectedGame === 'minerador' ? 'Minerador Pro' : 'Sequência Master';
}

async function createInvite() {
    const btn = document.getElementById('createBtn');
    btn.disabled = true;
    btn.textContent = 'Criando...';
    
    try {
        const inviteData = {
            childName: document.getElementById('childName').value.trim(),
            age: parseInt(document.getElementById('age').value),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value.trim(),
            location: document.getElementById('location').value.trim(),
            theme: document.getElementById('theme').value.trim(),
            gameType: selectedGame
        };
        
        const response = await fetch('/api/invites', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inviteData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar convite');
        }
        
        const data = await response.json();
        const inviteUrl = `${window.location.origin}/i/${data.invite.id}`;
        
        document.getElementById('inviteLink').value = inviteUrl;
        currentStep = 4;
        showStep(4);
        
    } catch (error) {
        console.error('Error creating invite:', error);
        alert('Erro ao criar convite: ' + error.message);
        btn.disabled = false;
        btn.textContent = '✨ Criar Convite';
    }
}

function copyLink() {
    const linkInput = document.getElementById('inviteLink');
    linkInput.select();
    document.execCommand('copy');
    
    const btn = event.target;
    btn.textContent = '✅ Copiado!';
    setTimeout(() => {
        btn.textContent = '📋 Copiar Link';
    }, 2000);
}

