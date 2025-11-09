# ⚡ Deploy Rápido - 3 Passos

## 🟢 Railway (RECOMENDADO - 5 minutos)

### Passo 1: Conectar GitHub
1. Acesse: https://railway.app
2. Login com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Selecione este repositório

### Passo 2: Configurar Variáveis
No dashboard do Railway, vá em **Variables** e adicione:

```
ADMIN_PASSWORD=sua_senha_segura
ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
ANTHROPIC_AUTH_TOKEN=seu_token
ANTHROPIC_MODEL=glm-4.6
ELEVENLABS_API_KEY=seu_key
```

### Passo 3: Pronto!
Railway faz deploy automático. Copie a URL gerada.

**URLs:**
- Convite: `https://seu-app.railway.app/invite`
- Admin: `https://seu-app.railway.app/admin`

---

## 🔵 Render (Alternativa)

1. Acesse: https://render.com
2. **New** → **Web Service**
3. Conecte GitHub → Selecione repo
4. Configure:
   - Build: `npm install`
   - Start: `npm start`
5. Adicione as mesmas variáveis de ambiente
6. Deploy!

---

## ⚡ Vercel (Serverless)

```bash
npm i -g vercel
vercel login
vercel
```

**⚠️ Nota**: Vercel usa filesystem temporário. Dados podem ser perdidos. Use Railway para persistência.

---

## ✅ Pronto!

Compartilhe o link `/invite` via WhatsApp! 🎉
