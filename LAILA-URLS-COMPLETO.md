# 🔗 TODAS AS PÁGINAS E URLs - Para Laila

## 🌐 URL Base de Produção
**https://elegant-wonder-production.up.railway.app**

---

## 📱 PÁGINAS PARA COMPARTILHAR (Convidados)

### 1. 🎮 Convite Principal do Heitor
**URLs:**
- `/heitor` - **PRINCIPAL (use esta)**
- `/invite-heitor` - Alternativa
- `/invite` - Alternativa antiga

**O que é:**
- Página inicial do convite interativo
- Animação de introdução
- Botões para escolher jogo (Minerador Pro ou Sequência Master)
- Informações da festa

**Compartilhar:** ✅ SIM - Envie via WhatsApp para os pais

---

### 2. ⛏️ Jogo Minerador Pro
**URL:** `/invite/game.html`

**O que é:**
- Jogo interativo de mineração
- Grid 4x4 de blocos
- Encontrar diamante revela convite
- Formulário RSVP após completar

**Acesso:** Automático ao clicar "MINERADOR PRO" na página do convite

---

### 3. 🎯 Jogo Sequência Master
**URL:** `/invite/game-sequence.html`

**O que é:**
- Jogo de memória (sequência de cores)
- 10 níveis progressivos
- Formulário RSVP após completar

**Acesso:** Automático ao clicar "SEQUÊNCIA MASTER" na página do convite

---

## 🔐 PÁGINAS PARA LAILA (Gerenciamento)

### 4. 🔐 Admin Dashboard (Laila)
**URLs:**
- `/admin-laila` - **PRINCIPAL (use esta)**
- `/admin` - Alternativa

**O que é:**
- Dashboard para gerenciar RSVPs
- Ver todas as confirmações
- Estatísticas (Total, Confirmados, Talvez, Não)
- Buscar e filtrar
- Exportar CSV

**Senha:** `heitor123`

**Compartilhar:** ❌ NÃO - Apenas para Laila

---

## 🚫 PÁGINAS DESATIVADAS/TEMPORÁRIAS

### 5. 🎤 Steve Bot (Assistente Minecraft)
**URL:** `/` (página principal)

**Status:** ⚠️ REDIRECIONADO para `/heitor`

**O que era:**
- Assistente virtual de Minecraft
- Chat com IA
- Reconhecimento de voz

**Acesso:** Não disponível temporariamente (redireciona para convite)

---

## 📊 PÁGINAS DO SISTEMA PRO (Futuro)

### 6. 📝 Dashboard Pro (Criadores)
**URL:** `/dashboard`

**O que é:**
- Sistema de contas PRO
- Criar múltiplos convites
- Gerenciar convites

**Status:** ✅ Funcionando, mas não necessário para Laila agora

---

### 7. ➕ Criar Convite (Pro)
**URL:** `/dashboard/create.html`

**O que é:**
- Wizard para criar novos convites
- Sistema de tokens

**Status:** ✅ Funcionando, mas não necessário para Laila agora

---

## 📄 PÁGINAS DE INFORMAÇÃO

### 8. ℹ️ Página de Informações
**URL:** `/info.html`

**O que é:**
- Informações técnicas do sistema
- URLs e credenciais
- Status

**Compartilhar:** ❌ Não necessário para Laila

---

## 🎯 RESUMO PARA LAILA

### ✅ O QUE ELA PRECISA:

1. **Para Compartilhar:**
   - **URL:** `https://elegant-wonder-production.up.railway.app/heitor`
   - Enviar via WhatsApp para os pais

2. **Para Gerenciar:**
   - **URL:** `https://elegant-wonder-production.up.railway.app/admin-laila`
   - **Senha:** `heitor123`

### ❌ O QUE ELA NÃO PRECISA:

- Dashboard Pro (`/dashboard`)
- Criar novos convites (por enquanto)
- Páginas técnicas (`/info.html`)

---

## 📋 TODAS AS ROTAS DO SERVIDOR

```
/                          → Redireciona para /heitor
/heitor                    → Página do convite (PRINCIPAL)
/invite-heitor            → Redireciona para /invite/index.html
/admin-laila              → Redireciona para /admin/dashboard.html
/invite                   → Redireciona para /invite/index.html
/invite/sequence          → Redireciona para /invite/game-sequence.html
/admin                    → Redireciona para /admin/dashboard.html
/dashboard                → Redireciona para /dashboard/login.html
/info                     → Redireciona para /info.html
```

---

## 🔧 APIs (Técnico)

- `/api/invite/rsvp` - POST - Enviar confirmação
- `/api/invite/rsvps` - GET - Listar RSVPs (requer senha)
- `/api/invite/stats` - GET - Estatísticas (requer senha)
- `/api/health` - GET - Status do servidor

---

**Última atualização:** 2025-01-XX

