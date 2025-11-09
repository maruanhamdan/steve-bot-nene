# 🚀 Guia de Deploy em Produção

## Opções de Deploy

### 1. 🟢 Railway (RECOMENDADO - Mais Simples)

Railway é a opção mais simples e permite filesystem, então o JSON funciona perfeitamente.

#### Passos:

1. **Acesse**: https://railway.app
2. **Login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione este repositório**
5. **Configure variáveis de ambiente**:
   ```
   ADMIN_PASSWORD=sua_senha_segura
   ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
   ANTHROPIC_AUTH_TOKEN=seu_token
   ANTHROPIC_MODEL=glm-4.6
   ELEVENLABS_API_KEY=seu_key (opcional)
   ```
6. **Deploy automático** - Railway detecta Node.js e faz deploy
7. **Pronto!** Railway gera URL automática tipo: `https://seu-app.railway.app`

**Vantagens:**
- ✅ Filesystem funciona (JSON persiste)
- ✅ Deploy automático do GitHub
- ✅ Grátis com limites generosos
- ✅ HTTPS automático
- ✅ Muito simples

---

### 2. 🔵 Render (Alternativa Simples)

Similar ao Railway, também permite filesystem.

#### Passos:

1. **Acesse**: https://render.com
2. **Login** com GitHub
3. **New** → **Web Service**
4. **Connect GitHub** → Selecione este repo
5. **Configure**:
   - **Name**: `steve-bot-invite`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Adicione variáveis de ambiente** (mesmas do Railway)
7. **Deploy**

**Vantagens:**
- ✅ Filesystem funciona
- ✅ Grátis (com sleep após inatividade)
- ✅ HTTPS automático

---

### 3. ⚡ Vercel (Serverless - Requer Ajustes)

Vercel é serverless, então o filesystem é temporário. Para produção na Vercel, seria melhor usar banco de dados.

**⚠️ ATENÇÃO**: Na Vercel, dados em `/tmp` são temporários e podem ser perdidos.

#### Passos:

1. **Instale Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Configure variáveis de ambiente** no dashboard da Vercel

**Limitações:**
- ❌ Filesystem temporário (dados podem ser perdidos)
- ✅ Melhor para frontend estático
- ✅ Muito rápido

**Recomendação**: Use Railway ou Render para este projeto.

---

## 📋 Variáveis de Ambiente Necessárias

Crie um arquivo `.env` ou configure no painel do serviço:

```env
# Admin
ADMIN_PASSWORD=sua_senha_segura_aqui

# Z.AI API (para o chat do Steve)
ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
ANTHROPIC_AUTH_TOKEN=seu_token_aqui
ANTHROPIC_MODEL=glm-4.6

# ElevenLabs (opcional - para voz)
ELEVENLABS_API_KEY=seu_key_aqui

# Porta (geralmente definida automaticamente)
PORT=3005
```

---

## 🔧 Ajustes Feitos para Produção

1. ✅ Código ajustado para detectar ambiente (Vercel vs outros)
2. ✅ Caminho de dados adaptável
3. ✅ Configurações para Railway, Render e Vercel
4. ✅ Export do app para serverless (Vercel)

---

## 🎯 Recomendação Final

**Use Railway** - É a opção mais simples e funciona perfeitamente com o sistema atual:

1. Conecta GitHub
2. Adiciona variáveis de ambiente
3. Deploy automático
4. Pronto!

---

## 📱 Após Deploy

1. **Teste o convite**: `https://seu-app.railway.app/invite`
2. **Teste o admin**: `https://seu-app.railway.app/admin`
3. **Compartilhe o link** via WhatsApp

---

## 🔒 Segurança

- ✅ Senha do admin configurável via env
- ✅ CORS configurado
- ✅ Validação de inputs
- ⚠️ Para produção, considere adicionar rate limiting

---

## 📊 Monitoramento

Após deploy, você pode:
- Ver logs no dashboard do serviço
- Monitorar uso de recursos
- Ver métricas de requisições

---

**Pronto para produção! 🚀**
