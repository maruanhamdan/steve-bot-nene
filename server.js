import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'heitor123'; // Simple password protection

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route redirects for easier access
app.get('/invite', (req, res) => {
  res.redirect('/invite/index.html');
});

app.get('/invite/new', (req, res) => {
  res.redirect('/invite/game-new.html');
});

app.get('/admin', (req, res) => {
  res.redirect('/admin/dashboard.html');
});

// Rota para página de informações (já servida como estático, mas mantendo para compatibilidade)
app.get('/info', (req, res) => {
  res.redirect('/info.html');
});

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
    const { childName, parentName, whatsapp, confirmation, notes } = req.body;

    // Validation
    if (!childName || !parentName || !whatsapp || !confirmation) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Sanitize inputs
    const rsvp = {
      id: Date.now().toString(),
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Steve está online!' });
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
