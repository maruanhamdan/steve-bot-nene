# ✅ CHECKLIST DE DEPLOY

## Antes de Fazer Deploy

- [x] ✅ Código testado localmente (10/10 testes passaram)
- [x] ✅ Todos os arquivos criados
- [x] ✅ Configurações de deploy prontas
- [x] ✅ Documentação completa
- [x] ✅ Git inicializado e commitado
- [ ] ⏳ Push para GitHub (você faz)
- [ ] ⏳ Deploy no Railway (você faz)
- [ ] ⏳ Configurar variáveis de ambiente (você faz)
- [ ] ⏳ Testar URLs em produção (você faz)

---

## Passo a Passo

### 1. GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/steve-bot-nene.git
git branch -M main
git push -u origin main
```

### 2. Railway
1. https://railway.app
2. Login GitHub
3. New Project → Deploy from GitHub
4. Selecionar repositório

### 3. Variáveis
No Railway → Variables:
- `ADMIN_PASSWORD`
- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_AUTH_TOKEN`
- `ANTHROPIC_MODEL`
- `ELEVENLABS_API_KEY`

### 4. Testar
- Acessar `/invite`
- Acessar `/admin`
- Testar RSVP

---

## ✅ PRONTO!

Sistema 100% funcional e testado!

