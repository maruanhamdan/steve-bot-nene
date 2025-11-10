# 🚀 GUIA DE DEPLOY

## 📋 Visão Geral

O projeto está configurado para deploy automático em **Railway.app** via GitHub.

---

## 🌐 Plataforma de Produção: Railway

### URL Atual
**https://elegant-wonder-production.up.railway.app**

### Como Funciona

1. **Push para GitHub** → Railway detecta mudanças
2. **Build automático** → Instala dependências
3. **Deploy** → Inicia servidor
4. **URL pública** → Disponível imediatamente

---

## ⚙️ Configuração do Railway

### Arquivo: `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### O que isso faz:
- **NIXPACKS**: Detecta automaticamente Node.js e instala dependências
- **startCommand**: Executa `npm start` (que roda `node server.js`)
- **Restart Policy**: Reinicia automaticamente se falhar (até 10 vezes)

---

## 🔐 Variáveis de Ambiente no Railway

### Configurar no Dashboard Railway:

1. Acesse: https://railway.app
2. Selecione o projeto
3. Vá em **Variables**
4. Adicione:

```
ADMIN_PASSWORD=heitor123
ANTHROPIC_BASE_URL=<sua-url>
ANTHROPIC_AUTH_TOKEN=<seu-token>
ANTHROPIC_MODEL=<modelo>
JWT_SECRET=<secret-aleatorio>
PORT=3005
```

### ⚠️ IMPORTANTE
- Não commitar tokens no código
- Usar variáveis de ambiente sempre
- Railway injeta essas variáveis no servidor

---

## 📦 Processo de Deploy

### 1. Preparar Código
```bash
# Garantir que está tudo commitado
git status

# Se houver mudanças
git add .
git commit -m "Descrição das mudanças"
```

### 2. Push para GitHub
```bash
git push origin main
```

### 3. Railway Detecta e Faz Deploy
- Automaticamente detecta o push
- Inicia build
- Faz deploy
- Servidor fica online

### 4. Verificar Deploy
- Acesse: https://elegant-wonder-production.up.railway.app
- Teste as funcionalidades
- Verifique logs no Railway dashboard

---

## 🔍 Monitoramento

### Ver Logs
1. Acesse Railway dashboard
2. Selecione o serviço
3. Aba **Logs**
4. Veja logs em tempo real

### Verificar Status
- **Deploy Logs**: Ver se build foi bem-sucedido
- **Runtime Logs**: Ver erros em tempo real
- **Metrics**: CPU, memória, etc.

---

## 🛠️ Deploy Manual (se necessário)

### Via Railway CLI
```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Deploy
railway up
```

### Via GitHub Actions (futuro)
- Pode configurar CI/CD automático
- Testes antes de deploy
- Deploy apenas se testes passarem

---

## 🔄 Rollback (Reverter Deploy)

### Se algo der errado:

1. **Via Git**:
```bash
# Reverter para commit anterior
git revert HEAD
git push origin main
```

2. **Via Railway Dashboard**:
- Vá em **Deployments**
- Selecione deploy anterior
- Clique em **Redeploy**

---

## ✅ Checklist de Deploy

Antes de fazer deploy:

- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] Todas as funcionalidades funcionando
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] Código commitado e pushado
- [ ] README atualizado (se necessário)
- [ ] Documentação atualizada (se necessário)

Após deploy:

- [ ] Verificar se servidor está online
- [ ] Testar páginas principais
- [ ] Testar formulários
- [ ] Testar admin
- [ ] Verificar logs (sem erros)
- [ ] Testar em mobile (se relevante)

---

## 🆘 Problemas Comuns

### Deploy falha no build
- Verificar se `package.json` está correto
- Verificar se todas dependências estão listadas
- Ver logs de build no Railway

### Servidor não inicia
- Verificar variáveis de ambiente
- Verificar se `PORT` está definido
- Ver logs de runtime

### Erro 404 nas rotas
- Verificar se rotas estão definidas antes de `express.static`
- Verificar se arquivos existem em `public/`
- Verificar ordem das rotas no `server.js`

### Dados não persistem
- Railway pode ter sistema de arquivos efêmero
- Considerar usar banco de dados (futuro)
- Fazer backup periódico

---

## 📊 Alternativas de Deploy

### Render.com
- Configurado em `render.yaml`
- Similar ao Railway
- Pode usar como backup

### Vercel
- Configurado em `vercel.json`
- Melhor para frontend estático
- Pode usar para páginas específicas

---

## 🔐 Segurança em Produção

### Boas Práticas
- ✅ Usar HTTPS (Railway fornece automaticamente)
- ✅ Não commitar tokens
- ✅ Usar variáveis de ambiente
- ✅ Senha admin forte
- ✅ Validar inputs
- ✅ Sanitizar dados

### Melhorias Futuras
- Rate limiting
- CORS mais restritivo
- Autenticação mais robusta
- Backup automático de dados

---

## 📚 Documentação Relacionada

- `DOCUMENTACAO-PRODUCAO.md` - Detalhes da produção
- `DESENVOLVIMENTO-LOCAL.md` - Setup local
- `README.md` - Visão geral

---

**Última atualização**: 2025-01-10
**Plataforma**: Railway.app


