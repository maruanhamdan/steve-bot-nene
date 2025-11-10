# 🛠️ GUIA DE DESENVOLVIMENTO LOCAL

## 🎯 Objetivo

Criar um ambiente de desenvolvimento/teste local para:
- ✅ Testar mudanças antes de fazer deploy
- ✅ Não estragar a produção
- ✅ Desenvolver novas features com segurança
- ✅ Debugar problemas localmente

---

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** (v18 ou superior)
- **npm** (vem com Node.js)
- **Git** (para controle de versão)
- **Editor de código** (VS Code recomendado)

### Verificar Instalação
```bash
node --version  # Deve ser v18+
npm --version   # Deve ser v9+
git --version   # Qualquer versão recente
```

---

## 🚀 Setup Inicial

### 1. Clonar/Atualizar Repositório
```bash
# Se já tem o projeto
cd steve-bot-nene
git pull origin main

# Se é primeira vez
git clone <url-do-repositorio>
cd steve-bot-nene
```

### 2. Instalar Dependências
```bash
npm install
```

Isso instala:
- `express` - Servidor web
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Variáveis de ambiente
- `bcryptjs` - Hash de senhas
- `jsonwebtoken` - Autenticação JWT

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz do projeto:

```env
# Porta do servidor local
PORT=3005

# Senha do admin (mesma da produção para testes)
ADMIN_PASSWORD=heitor123

# API Z.AI (Anthropic)
ANTHROPIC_BASE_URL=https://api.z.ai/v1
ANTHROPIC_AUTH_TOKEN=seu_token_aqui
ANTHROPIC_MODEL=glm-4.6

# JWT Secret (para autenticação)
JWT_SECRET=dev-secret-key-change-in-production

# Ambiente
NODE_ENV=development
```

**⚠️ IMPORTANTE**: 
- Não commitar o arquivo `.env` (já está no `.gitignore`)
- Use tokens de desenvolvimento/teste
- Não use tokens de produção em local

### 4. Criar Diretório de Dados
```bash
mkdir -p data
```

O servidor criará os arquivos JSON automaticamente quando necessário.

---

## ▶️ Executar Servidor Local

### Modo Normal
```bash
npm start
```

Servidor inicia em: **http://localhost:3005**

### Modo Watch (Reinicia automaticamente)
```bash
npm run dev
```

Útil durante desenvolvimento - reinicia quando você salva arquivos.

---

## 🧪 Testar Localmente

### URLs Locais
- **Página principal**: http://localhost:3005/heitor
- **Convite**: http://localhost:3005/invite
- **Confirmação rápida**: http://localhost:3005/confirmar
- **Admin**: http://localhost:3005/admin-laila
- **Jogo 1**: http://localhost:3005/invite/game.html
- **Jogo 2**: http://localhost:3005/invite/game-sequence.html

### Testar Funcionalidades

#### 1. Testar Formulário RSVP
1. Acesse `/confirmar`
2. Preencha o formulário
3. Envie
4. Verifique se aparece em `/admin-laila`

#### 2. Testar Jogos
1. Acesse `/invite`
2. Escolha um jogo
3. Jogue até encontrar o convite
4. Preencha o formulário
5. Verifique no admin

#### 3. Testar Admin
1. Acesse `/admin-laila`
2. Login com senha: `heitor123`
3. Verifique se vê os RSVPs
4. Teste busca e filtros
5. Teste export CSV

---

## 🔄 Workflow de Desenvolvimento

### 1. Criar Branch para Nova Feature
```bash
git checkout -b feature/nova-funcionalidade
```

### 2. Desenvolver Localmente
- Fazer mudanças no código
- Testar em `http://localhost:3005`
- Verificar se tudo funciona

### 3. Testar Antes de Commitar
```bash
# Executar testes (se houver)
npm test

# Verificar se servidor inicia
npm start
```

### 4. Commit e Push
```bash
git add .
git commit -m "Descrição da mudança"
git push origin feature/nova-funcionalidade
```

### 5. Deploy (após aprovação)
- Merge para `main`
- Railway faz deploy automático
- Verificar produção

---

## 🐛 Debugging

### Ver Logs no Console
O servidor mostra logs no terminal:
- Requisições recebidas
- Erros
- Dados salvos

### Verificar Dados
```bash
# Ver RSVPs salvos
cat data/rsvps.json

# Ver usuários (se houver)
cat data/users.json

# Ver convites (se houver)
cat data/invites.json
```

### Limpar Dados de Teste
```bash
# CUIDADO: Isso apaga todos os dados!
rm data/*.json
```

---

## 📁 Estrutura do Projeto

```
steve-bot-nene/
├── server.js              # Servidor principal
├── package.json           # Dependências
├── .env                   # Variáveis de ambiente (NÃO commitar)
├── data/                  # Dados (JSON files)
│   ├── rsvps.json
│   ├── users.json
│   └── invites.json
├── public/                # Arquivos estáticos
│   ├── heitor.html        # Página com vídeo
│   ├── rsvp.html          # Confirmação rápida
│   ├── invite/           # Jogos e convite
│   ├── admin/            # Painel admin
│   └── ...
└── docs/                  # Documentação
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm start          # Inicia servidor
npm run dev        # Modo watch (auto-reload)
npm test           # Executa testes
```

### Git
```bash
git status         # Ver mudanças
git diff          # Ver diferenças
git log            # Ver histórico
```

### Limpeza
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar dados de teste
rm data/*.json
```

---

## ⚠️ Regras Importantes

### ✅ FAZER
- Sempre testar localmente antes de fazer deploy
- Usar branch separada para novas features
- Commitar mudanças pequenas e frequentes
- Verificar se tudo funciona antes de push

### ❌ NÃO FAZER
- Não commitar `.env` com tokens reais
- Não fazer deploy direto sem testar
- Não alterar produção manualmente
- Não commitar dados de teste (`data/*.json`)

---

## 🆘 Problemas Comuns

### Porta já em uso
```bash
# Ver o que está usando a porta 3005
lsof -i :3005

# Matar processo
kill -9 <PID>
```

### Erro ao instalar dependências
```bash
# Limpar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Servidor não inicia
1. Verificar se `.env` existe
2. Verificar se `PORT` está definido
3. Verificar logs de erro
4. Verificar se `data/` existe

### Dados não salvam
1. Verificar permissões da pasta `data/`
2. Verificar se servidor tem permissão de escrita
3. Verificar logs de erro

---

## 📚 Próximos Passos

1. **Ler documentação de produção**: `DOCUMENTACAO-PRODUCAO.md`
2. **Ler guia de deploy**: `DEPLOY.md`
3. **Explorar código**: Começar por `server.js`
4. **Testar tudo**: Garantir que entende o fluxo

---

## 🎯 Checklist Antes de Deploy

- [ ] Código testado localmente
- [ ] Todas as funcionalidades funcionando
- [ ] Sem erros no console
- [ ] Dados sendo salvos corretamente
- [ ] Formulários validando
- [ ] Admin acessível
- [ ] Mudanças commitadas
- [ ] README atualizado (se necessário)

---

**Última atualização**: 2025-01-10
**Ambiente**: Desenvolvimento Local


