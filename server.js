import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// RSVP Data File - Ajustado para funcionar em produção
// Na Vercel, usa /tmp (temporário) ou variável de ambiente para dados pequenos
// Em outros serviços (Railway/Render), usa o diretório data normalmente
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR) && !process.env.VERCEL) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const RSVP_FILE = path.join(DATA_DIR, 'rsvps.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'heitor123';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INVITES_FILE = path.join(DATA_DIR, 'invites.json');
const JWT_SECRET = process.env.JWT_SECRET || 'invitemanager-secret-key-change-in-production';

// Helper functions for RSVP data
async function readRSVPs() {
  try {
    if (!fs.existsSync(RSVP_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(RSVP_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    return [];
  }
}

async function writeRSVPs(rsvps) {
  try {
    await fs.promises.writeFile(RSVP_FILE, JSON.stringify(rsvps, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing RSVPs:', error);
    return false;
  }
}

// ==================== PRO SYSTEM HELPERS ====================

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

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ROTAS ESPECÍFICAS (ANTES DO STATIC) ====================

// Redirecionar página principal do Steve para /heitor
app.get('/', (req, res) => {
  res.redirect('/heitor');
});

// Rota /heitor - Página com vídeo e botão
app.get('/heitor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'heitor.html'));
});

// Rota /invite-heitor - Mesmo que /invite mas com nome específico
app.get('/invite-heitor', (req, res) => {
  res.redirect('/invite/index.html');
});

// Rota /confirmar - Confirmação rápida (sem jogos)
app.get('/confirmar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rsvp.html'));
});

// Rota /rsvp - Alias para /confirmar
app.get('/rsvp', (req, res) => {
  res.redirect('/confirmar');
});

// Route redirects for easier access
app.get('/invite', (req, res) => {
  res.redirect('/invite/index.html');
});

app.get('/invite/sequence', (req, res) => {
  res.redirect('/invite/game-sequence.html');
});

// Rota /admin - Admin para Laila
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// Rota específica para servir admin.js (forçar atualização - ler do sistema de arquivos)
app.get('/admin/admin.js', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'application/javascript');
    
    const filePath = path.join(__dirname, 'public', 'admin', 'admin.js');
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    res.send(fileContent);
  } catch (error) {
    console.error('Error serving admin.js:', error);
    res.status(500).send('Error loading admin.js');
  }
});

app.get('/dashboard', (req, res) => {
  res.redirect('/dashboard/login.html');
});

// Rota para página de informações (já servida como estático, mas mantendo para compatibilidade)
app.get('/info', (req, res) => {
  res.redirect('/info.html');
});

// Servir arquivos estáticos (DEPOIS das rotas específicas)
app.use(express.static('public'));

// Lista de palavras/tópicos bloqueados para crianças
const blockedKeywords = [
  'sexo', 'adulto', 'pornografia', 'drogas', 'violência extrema', 
  'armas reais', 'conteúdo adulto', 'site adulto', 'xxx'
];

// Função para verificar conteúdo inapropriado
function hasInappropriateContent(text) {
  const lowerText = text.toLowerCase();
  return blockedKeywords.some(keyword => lowerText.includes(keyword));
}

// System prompt otimizado para Steve - Assistente do Minecraft
const STEVE_SYSTEM_PROMPT = `Você é o Steve, parceiro de Minecraft de uma criança de 6 anos chamada Heitor. Você é como um irmão mais velho legal, animado mas não infantil.

IMPORTANTE - CRIANÇA QUE SABE DAS COISAS:
- A criança CONHECE Minecraft, não precisa explicar tudo
- Use FRASES CURTAS e diretas (5-8 palavras)
- Fale como um amigo maneiro, não como professor
- NUNCA use palavras como "card", "botão", "clique" - criança não entende interface
- Use linguagem de quem joga junto: "Vamos", "Bora", "Faz assim"
- Mencione NOMES dos itens claramente

PERSONALIDADE:
- Brother descolado, não infantil
- Animado mas natural
- Fala igual jogador experiente ajudando amigo
- Use gírias leves: "massa", "top", "dahora"

FORMATO DE RESPOSTA (IMPORTANTE):
✅ FAÇA ASSIM:
"Espada de diamante? Massa!
Pega 2 diamantes e 1 graveto.
Bora na bancada de craft.
Coloca tipo espada.
Pronto, tá dahora!"

❌ NÃO FAÇA:
- Textos longos
- Palavras técnicas de interface (card, botão, clique, tela)
- Explicações de bebê
- Parágrafos enormes

CONHECIMENTO:
- Minecraft completo: builds, crafting, mobs, redstone, farms
- Fale como quem joga muito
- Use passos curtos (1, 2, 3)
- Emojis nos itens importantes

SEGURANÇA E LINGUAGEM APROPRIADA (SUPER IMPORTANTE):
- NUNCA fale de conteúdo adulto ou sexual
- EVITE palavras que possam ter duplo sentido como: "fundo", "mina" (use "caverna" ou "túnel")
- Use sempre: "descer na caverna", "procurar em túneis", "cavar para baixo"
- NUNCA diga: "vai fundo", "bem fundo", "vai fundo na mina", "desce na mina", "mina profunda"
- Se pergunta estranha: "Cara, isso não é de Minecraft! Bora falar do jogo?"
- Mantenha tudo 100% limpo e apropriado para criança

EXEMPLOS DE FRASES CORRETAS:
✅ "Diamantes? Desce até camada 12!"
✅ "Cava para baixo com cuidado!"
✅ "Procura em cavernas escuras!"
✅ "Vai bem baixo nas cavernas!"
✅ "Desce bastante nas cavernas!"

EXEMPLOS DE FRASES PROIBIDAS:
❌ "Vai fundo na mina"
❌ "Desce na mina"
❌ "Vai bem fundo" (NUNCA)
❌ "Bem fundo" (NUNCA)
❌ "Vai fundo" (NUNCA)

LEMBRE-SE: Brother descolado ajudando criança que JÁ JOGA! Natural, curto, direto e 100% APROPRIADO!`;

// Endpoint principal para chat com Steve
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Verificar conteúdo inapropriado
    if (hasInappropriateContent(message)) {
      return res.json({
        response: "Desculpe, não posso falar sobre isso! Que tal me perguntar sobre Minecraft? Posso te ajudar com builds incríveis, como fazer uma espada de diamante, ou como construir uma casa segura! O que você quer saber?"
      });
    }

    // Fazer chamada para Z.AI API (compatível com formato Anthropic)
    const apiResponse = await fetch(`${process.env.ANTHROPIC_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_AUTH_TOKEN,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        system: STEVE_SYSTEM_PROMPT
      })
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Erro da API Z.AI:', errorText);
      throw new Error(`API Error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    
    // Extrair resposta do formato Anthropic
    const assistantMessage = data.content[0].text;

    res.json({ response: assistantMessage });

  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({ 
      error: 'Erro ao processar mensagem',
      response: 'Ops! Tive um problema. Pode tentar perguntar de novo? Estou aqui para ajudar com Minecraft!' 
    });
  }
});

// Endpoint para listar vozes do ElevenLabs
app.get('/api/elevenlabs/voices', async (req, res) => {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      }
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro ao listar vozes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint TTS - ELEVENLABS VOZ CUSTOMIZADA!
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Texto é obrigatório' });
    }
    
    // Se não passar voiceId, buscar a voz "Steve-nene"
    let targetVoiceId = voiceId;
    
    if (!targetVoiceId) {
      // Listar vozes para encontrar "Steve-nene"
      const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        }
      });
      
      const voicesData = await voicesResponse.json();
      const steveVoice = voicesData.voices.find(v => v.name === 'Steve-nene');
      
      if (steveVoice) {
        targetVoiceId = steveVoice.voice_id;
        console.log('✅ Voz Steve-nene encontrada:', targetVoiceId);
      } else {
        return res.status(404).json({ error: 'Voz Steve-nene não encontrada' });
      }
    }
    
    // Gerar áudio com ElevenLabs - VOZ MELHORADA E NATURAL!
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.75,              // Mais estabilidade = menos variação
          similarity_boost: 0.85,       // Mantém similaridade com voz original
          style: 0.0,                   // SEM exagero = mais natural
          use_speaker_boost: true       // Melhora clareza
        },
        pronunciation_dictionary_locators: [],  // Sem dicionário customizado por enquanto
        apply_text_normalization: 'on',         // Normaliza texto automaticamente
        language_code: 'pt'                     // FORÇA PORTUGUÊS!
      })
    });
    
    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      throw new Error(`ElevenLabs error: ${errorText}`);
    }
    
    // Converter para buffer e retornar como base64
    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    res.json({
      audio: base64Audio,
      format: 'mp3'
    });
    
  } catch (error) {
    console.error('Erro no TTS ElevenLabs:', error);
    res.status(500).json({ error: 'Erro ao gerar áudio: ' + error.message });
  }
});

// ==================== RSVP API ENDPOINTS ====================

// Submit RSVP
app.post('/api/invite/rsvp', async (req, res) => {
  try {
    const { inviteId, childName, parentName, whatsapp, confirmation, notes } = req.body;

    // Validation
    if (!childName || !parentName || !whatsapp || !confirmation) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Sanitize inputs
    const rsvp = {
      id: Date.now().toString(),
      inviteId: inviteId || null, // Linkar ao convite se fornecido
      childName: childName.trim(),
      parentName: parentName.trim(),
      whatsapp: whatsapp.trim(),
      confirmation: confirmation,
      notes: notes ? notes.trim() : null,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Read existing RSVPs
    const rsvps = await readRSVPs();
    
    // Check for duplicates (same child name and whatsapp)
    const duplicate = rsvps.find(r => 
      r.childName.toLowerCase() === rsvp.childName.toLowerCase() &&
      r.whatsapp === rsvp.whatsapp
    );

    if (duplicate) {
      // Update existing RSVP
      const index = rsvps.findIndex(r => r.id === duplicate.id);
      rsvps[index] = { ...rsvps[index], ...rsvp, id: duplicate.id };
    } else {
      // Add new RSVP
      rsvps.push(rsvp);
    }

    // Write back to file
    const success = await writeRSVPs(rsvps);
    
    if (!success) {
      return res.status(500).json({ error: 'Erro ao salvar confirmação' });
    }

    res.json({ 
      success: true, 
      message: 'Confirmação enviada com sucesso!',
      rsvp: duplicate ? rsvps.find(r => r.id === duplicate.id) : rsvp
    });

  } catch (error) {
    console.error('Error in RSVP submission:', error);
    res.status(500).json({ error: 'Erro ao processar confirmação' });
  }
});

// Get all RSVPs (Admin only)
app.get('/api/invite/rsvps', async (req, res) => {
  try {
    const password = req.query.password || req.headers.authorization?.replace('Bearer ', '');
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const rsvps = await readRSVPs();
    res.json({ rsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Erro ao buscar confirmações' });
  }
});

// Get statistics
app.get('/api/invite/stats', async (req, res) => {
  try {
    const password = req.query.password || req.headers.authorization?.replace('Bearer ', '');
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const rsvps = await readRSVPs();
    
    const stats = {
      total: rsvps.length,
      confirmed: rsvps.filter(r => r.confirmation === 'yes').length,
      maybe: rsvps.filter(r => r.confirmation === 'maybe').length,
      declined: rsvps.filter(r => r.confirmation === 'no').length,
      pending: rsvps.filter(r => r.status === 'pending').length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Update RSVP status
app.put('/api/invite/rsvp/:id', async (req, res) => {
  try {
    const password = req.query.password || req.headers.authorization?.replace('Bearer ', '');
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const rsvps = await readRSVPs();
    const index = rsvps.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'RSVP não encontrado' });
    }

    rsvps[index].status = status || rsvps[index].status;
    
    const success = await writeRSVPs(rsvps);
    
    if (!success) {
      return res.status(500).json({ error: 'Erro ao atualizar RSVP' });
    }

    res.json({ success: true, rsvp: rsvps[index] });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({ error: 'Erro ao atualizar RSVP' });
  }
});

// Delete RSVP
app.delete('/api/invite/rsvp/:id', async (req, res) => {
  try {
    const password = req.query.password || req.headers.authorization?.replace('Bearer ', '');
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { id } = req.params;

    const rsvps = await readRSVPs();
    const index = rsvps.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'RSVP não encontrado' });
    }

    // Remove o RSVP do array
    rsvps.splice(index, 1);
    
    const success = await writeRSVPs(rsvps);
    
    if (!success) {
      return res.status(500).json({ error: 'Erro ao deletar RSVP' });
    }

    res.json({ success: true, message: 'RSVP deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ error: 'Erro ao deletar RSVP' });
  }
});

// ==================== LEADERBOARD API ====================
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

async function readLeaderboard() {
  try {
    if (!fs.existsSync(LEADERBOARD_FILE)) {
      return { game1: [], game2: [] };
    }
    const data = await fs.promises.readFile(LEADERBOARD_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return { game1: [], game2: [] };
  }
}

async function writeLeaderboard(leaderboard) {
  try {
    await fs.promises.writeFile(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing leaderboard:', error);
    return false;
  }
}

// Submit score
app.post('/api/leaderboard/score', async (req, res) => {
  try {
    const { gameType, playerName, score, time, blocks, timestamp } = req.body;
    
    if (!gameType || !playerName || score === undefined) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    const leaderboard = await readLeaderboard();
    const gameKey = (gameType === 'minerador') ? 'game1' : 'game2';
    
    const entry = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score: parseInt(score),
      time: time || 0,
      blocks: blocks || 0,
      timestamp: timestamp || new Date().toISOString()
    };
    
    if (!leaderboard[gameKey]) {
      leaderboard[gameKey] = [];
    }
    
    leaderboard[gameKey].push(entry);
    
    // Manter apenas top 50
    leaderboard[gameKey].sort((a, b) => {
      // Maior pontuação primeiro, depois menor tempo, depois menos blocos
      if (b.score !== a.score) return b.score - a.score;
      if (a.time !== b.time) return a.time - b.time;
      return a.blocks - b.blocks;
    });
    
    leaderboard[gameKey] = leaderboard[gameKey].slice(0, 50);
    
    await writeLeaderboard(leaderboard);
    
    // Calcular posição
    const position = leaderboard[gameKey].findIndex(e => e.id === entry.id) + 1;
    
    res.json({
      success: true,
      position,
      entry
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Erro ao salvar pontuação' });
  }
});

// Get leaderboard
app.get('/api/leaderboard/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await readLeaderboard();
    const gameKey = (gameType === 'minerador') ? 'game1' : 'game2';
    
    const scores = (leaderboard[gameKey] || []).slice(0, limit);
    
    res.json({ scores });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Erro ao buscar leaderboard' });
  }
});

// ==================== AUTH API ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const users = await readUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

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
      gameType: gameType,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const invites = await readInvites();
    invites.push(invite);
    await writeInvites(invites);

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

// Link único do convite
app.get('/i/:inviteId', async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invites = await readInvites();
    const invite = invites.find(i => i.id === inviteId);

    if (!invite) {
      return res.status(404).send('Convite não encontrado');
    }

    res.redirect(`/invite/index.html?inviteId=${inviteId}`);
  } catch (error) {
    console.error('Error in /i/:inviteId:', error);
    res.status(500).send('Erro ao carregar convite');
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InviteManager Pro está online!' });
});

// Export para Vercel serverless
export default app;

// Iniciar servidor apenas se não estiver na Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🎮 STEVE BOT RODANDO!`);
    console.log(`🌐 Abra: http://localhost:${PORT}`);
    console.log(`📡 API Z.AI: ${process.env.ANTHROPIC_BASE_URL}`);
    console.log(`🤖 Modelo: ${process.env.ANTHROPIC_MODEL}`);
    console.log(`🎤 VOZ: ElevenLabs - Steve-nene (CUSTOMIZADA!) ⭐\n`);
  });
}
// Force redeploy - $(date)
// Deploy: Tue Nov 11 11:42:42 -03 2025
// Server deploy: 1762872655


