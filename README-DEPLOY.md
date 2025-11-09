# 🚀 Sistema Pronto para Produção!

## ✅ O que foi configurado:

1. ✅ **Código ajustado** para funcionar em produção
2. ✅ **Railway** configurado (recomendado)
3. ✅ **Render** configurado (alternativa)
4. ✅ **Vercel** configurado (serverless)
5. ✅ **Persistência de dados** adaptável por ambiente
6. ✅ **Variáveis de ambiente** documentadas

---

## 🎯 RECOMENDAÇÃO: Use Railway

**Por quê?**
- ✅ Mais simples (3 cliques)
- ✅ Filesystem funciona (dados persistem)
- ✅ Grátis com limites generosos
- ✅ Deploy automático do GitHub
- ✅ HTTPS automático

### Como fazer (5 minutos):

1. **Acesse**: https://railway.app
2. **Login** com GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione este repositório**
5. **Adicione variáveis de ambiente**:
   ```
   ADMIN_PASSWORD=sua_senha_segura
   ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
   ANTHROPIC_AUTH_TOKEN=seu_token
   ANTHROPIC_MODEL=glm-4.6
   ELEVENLABS_API_KEY=seu_key
   ```
6. **Pronto!** Railway faz o resto automaticamente

**URL gerada**: `https://seu-app.railway.app`

---

## 📋 Variáveis de Ambiente Necessárias

Configure estas no painel do serviço escolhido:

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `ADMIN_PASSWORD` | Senha do painel admin | ✅ Sim |
| `ANTHROPIC_BASE_URL` | URL da API Z.AI | ✅ Sim |
| `ANTHROPIC_AUTH_TOKEN` | Token da API Z.AI | ✅ Sim |
| `ANTHROPIC_MODEL` | Modelo (glm-4.6) | ✅ Sim |
| `ELEVENLABS_API_KEY` | Key do ElevenLabs | ⚠️ Opcional |
| `PORT` | Porta (geralmente automático) | ❌ Não |

---

## 🔗 URLs Após Deploy

- **Convite**: `https://seu-app.railway.app/invite`
- **Admin**: `https://seu-app.railway.app/admin` (senha: configurada em env)
- **Health**: `https://seu-app.railway.app/api/health`

---

## 📱 Compartilhar

Após deploy, compartilhe o link `/invite` via WhatsApp!

---

## 🔧 Arquivos Criados

- `vercel.json` - Configuração Vercel
- `railway.json` - Configuração Railway
- `render.yaml` - Configuração Render
- `DEPLOY.md` - Guia completo
- `DEPLOY-QUICK.md` - Guia rápido

---

## ⚠️ Notas Importantes

1. **Railway/Render**: Dados persistem normalmente (JSON funciona)
2. **Vercel**: Filesystem temporário (dados podem ser perdidos)
3. **Senha Admin**: Configure via `ADMIN_PASSWORD` em produção
4. **Backup**: Exporte CSV do admin regularmente

---

## ✅ Tudo Pronto!

O sistema está 100% configurado para produção. Escolha Railway e faça deploy em 5 minutos! 🚀
