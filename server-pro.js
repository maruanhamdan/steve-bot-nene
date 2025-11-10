// ==================== INVITEMANAGER PRO - Sistema Multi-Convite ====================
// Este arquivo será integrado ao server.js principal

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'invitemanager-secret-key-change-in-production';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INVITES_FILE = path.join(DATA_DIR, 'invites.json');

// ==================== HELPERS ====================

async function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

async function writeUsers(users) {
  try {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

async function readInvites() {
  try {
    if (!fs.existsSync(INVITES_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(INVITES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading invites:', error);
    return [];
  }
}

async function writeInvites(invites) {
  try {
    await fs.promises.writeFile(INVITES_FILE, JSON.stringify(invites, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing invites:', error);
    return false;
  }
}

function generateInviteId() {
  return 'inv_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function generateUserId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// ==================== AUTH API ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const users = await readUsers();
    
    // Verificar se email já existe
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: generateUserId(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      tokens: 5, // Tokens iniciais grátis
      createdAt: new Date().toISOString()
    };

    users.push(user);
    await writeUsers(users);

    // Gerar token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tokens: user.tokens
      },
      token
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tokens: user.tokens
      },
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      tokens: user.tokens
    });
  } catch (error) {
    console.error('Error in /auth/me:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// ==================== INVITES API ====================

// Create invite
app.post('/api/invites', authenticateToken, async (req, res) => {
  try {
    const { childName, age, date, time, location, theme, gameType } = req.body;

    if (!childName || !age || !date || !time || !location || !theme || !gameType) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const users = await readUsers();
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar tokens
    if (user.tokens < 1) {
      return res.status(402).json({ error: 'Tokens insuficientes. Compre mais tokens para criar convites.' });
    }

    const invite = {
      id: generateInviteId(),
      userId: req.user.userId,
      childName: childName.trim(),
      age: parseInt(age),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      theme: theme.trim(),
      gameType: gameType, // 'minerador' ou 'sequencia'
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const invites = await readInvites();
    invites.push(invite);
    await writeInvites(invites);

    // Consumir token
    user.tokens -= 1;
    await writeUsers(users);

    res.json({
      success: true,
      invite,
      remainingTokens: user.tokens
    });
  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ error: 'Erro ao criar convite' });
  }
});

// Get user's invites
app.get('/api/invites', authenticateToken, async (req, res) => {
  try {
    const invites = await readInvites();
    const userInvites = invites.filter(i => i.userId === req.user.userId);

    res.json({ invites: userInvites });
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Erro ao buscar convites' });
  }
});

// Get invite by ID (público)
app.get('/api/invites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invites = await readInvites();
    const invite = invites.find(i => i.id === id);

    if (!invite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    res.json({ invite });
  } catch (error) {
    console.error('Error fetching invite:', error);
    res.status(500).json({ error: 'Erro ao buscar convite' });
  }
});

// Update invite
app.put('/api/invites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const invites = await readInvites();
    const index = invites.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    if (invites[index].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Sem permissão para editar este convite' });
    }

    invites[index] = { ...invites[index], ...updates, updatedAt: new Date().toISOString() };
    await writeInvites(invites);

    res.json({ success: true, invite: invites[index] });
  } catch (error) {
    console.error('Error updating invite:', error);
    res.status(500).json({ error: 'Erro ao atualizar convite' });
  }
});

// Delete invite
app.delete('/api/invites/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const invites = await readInvites();
    const index = invites.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    if (invites[index].userId !== req.user.userId) {
      return res.status(403).json({ error: 'Sem permissão para deletar este convite' });
    }

    invites.splice(index, 1);
    await writeInvites(invites);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting invite:', error);
    res.status(500).json({ error: 'Erro ao deletar convite' });
  }
});

// ==================== ROUTE: Link Único ====================

app.get('/i/:inviteId', async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invites = await readInvites();
    const invite = invites.find(i => i.id === inviteId);

    if (!invite) {
      return res.status(404).send('Convite não encontrado');
    }

    // Redirecionar para página do convite com dados
    res.redirect(`/invite/index.html?inviteId=${inviteId}`);
  } catch (error) {
    console.error('Error in /i/:inviteId:', error);
    res.status(500).send('Erro ao carregar convite');
  }
});

// ==================== STATS API ====================

// Get invite stats
app.get('/api/invites/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const invites = await readInvites();
    const invite = invites.find(i => i.id === id);

    if (!invite || invite.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }

    const rsvps = await readRSVPs();
    const inviteRSVPs = rsvps.filter(r => r.inviteId === id);

    const stats = {
      totalRSVPs: inviteRSVPs.length,
      confirmed: inviteRSVPs.filter(r => r.confirmation === 'yes').length,
      maybe: inviteRSVPs.filter(r => r.confirmation === 'maybe').length,
      declined: inviteRSVPs.filter(r => r.confirmation === 'no').length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

