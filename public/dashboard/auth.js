// Auth System
let currentUser = null;
let authToken = null;

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    authToken = localStorage.getItem('authToken');
    if (authToken) {
        checkAuth();
    }
    
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
    document.getElementById('loginPassword')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Register form
    document.getElementById('registerBtn')?.addEventListener('click', handleRegister);
    
    // Toggle forms
    document.getElementById('showRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    });
    
    document.getElementById('showLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (!email || !password) {
        errorEl.textContent = 'Preencha todos os campos';
        errorEl.style.display = 'block';
        return;
    }
    
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Entrando...';
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/dashboard/index.html';
        } else {
            errorEl.textContent = data.error || 'Erro ao fazer login';
            errorEl.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Entrar';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorEl.textContent = 'Erro de conexão. Tente novamente.';
        errorEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Entrar';
    }
}

async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');
    
    if (!name || !email || !password) {
        errorEl.textContent = 'Preencha todos os campos';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorEl.textContent = 'Senha deve ter no mínimo 6 caracteres';
        errorEl.style.display = 'block';
        return;
    }
    
    const btn = document.getElementById('registerBtn');
    btn.disabled = true;
    btn.textContent = 'Criando...';
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/dashboard/index.html';
        } else {
            errorEl.textContent = data.error || 'Erro ao criar conta';
            errorEl.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Criar Conta';
        }
    } catch (error) {
        console.error('Register error:', error);
        errorEl.textContent = 'Erro de conexão. Tente novamente.';
        errorEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Criar Conta';
    }
}

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            // Se estiver na página de login, redirecionar para dashboard
            if (window.location.pathname.includes('login.html')) {
                window.location.href = '/dashboard/index.html';
            }
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

