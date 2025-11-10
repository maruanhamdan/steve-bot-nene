# 📄 TODAS AS PÁGINAS DO SISTEMA

## 🌐 URL Base
**https://elegant-wonder-production.up.railway.app**

---

## 🎯 PÁGINAS PARA LAILA (O QUE ELA PRECISA)

### ✅ 1. CONVITE PARA COMPARTILHAR
**URL:** `https://elegant-wonder-production.up.railway.app/heitor`

**Arquivo:** `public/invite/index.html`

**O que faz:**
- Página inicial do convite do Heitor
- Animação de introdução
- Botões para escolher jogo
- Informações da festa

**Status:** ✅ ATIVO - Use esta para compartilhar

---

### ✅ 2. ADMIN PARA LAILA GERENCIAR
**URL:** `https://elegant-wonder-production.up.railway.app/admin-laila`

**Arquivo:** `public/admin/dashboard.html`

**O que faz:**
- Ver todos os RSVPs
- Estatísticas (Total, Confirmados, Talvez, Não)
- Buscar e filtrar
- Exportar CSV

**Senha:** `heitor123`

**Status:** ✅ ATIVO - Use esta para gerenciar

---

## 🎮 PÁGINAS DOS JOGOS (Automáticas)

### 3. JOGO MINERADOR PRO
**URL:** `https://elegant-wonder-production.up.railway.app/invite/game.html`

**Arquivo:** `public/invite/game.html`

**O que faz:**
- Jogo de mineração 4x4
- Encontrar diamante revela convite
- Formulário RSVP integrado

**Acesso:** Automático ao clicar "MINERADOR PRO"

---

### 4. JOGO SEQUÊNCIA MASTER
**URL:** `https://elegant-wonder-production.up.railway.app/invite/game-sequence.html`

**Arquivo:** `public/invite/game-sequence.html`

**O que faz:**
- Jogo de memória (sequência de cores)
- 10 níveis
- Formulário RSVP integrado

**Acesso:** Automático ao clicar "SEQUÊNCIA MASTER"

---

## 🚫 PÁGINAS DESATIVADAS/TEMPORÁRIAS

### 5. STEVE BOT (Assistente Minecraft)
**URL:** `https://elegant-wonder-production.up.railway.app/`

**Arquivo:** `public/index.html`

**Status:** ⚠️ REDIRECIONADO para `/heitor`

**O que era:**
- Assistente virtual de Minecraft
- Chat com IA

**Acesso:** Não disponível (redireciona)

---

## 📊 PÁGINAS DO SISTEMA PRO (Não necessário para Laila agora)

### 6. DASHBOARD PRO (Login)
**URL:** `https://elegant-wonder-production.up.railway.app/dashboard`

**Arquivo:** `public/dashboard/login.html`

**O que faz:**
- Login para criadores PRO
- Sistema de contas

**Status:** ✅ Funcionando, mas não necessário

---

### 7. DASHBOARD PRO (Principal)
**URL:** `https://elegant-wonder-production.up.railway.app/dashboard/index.html`

**Arquivo:** `public/dashboard/index.html`

**O que faz:**
- Gerenciar múltiplos convites
- Sistema de tokens

**Status:** ✅ Funcionando, mas não necessário

---

### 8. CRIAR CONVITE PRO
**URL:** `https://elegant-wonder-production.up.railway.app/dashboard/create.html`

**Arquivo:** `public/dashboard/create.html`

**O que faz:**
- Wizard para criar novos convites

**Status:** ✅ Funcionando, mas não necessário

---

## 📄 PÁGINAS DE INFORMAÇÃO

### 9. PÁGINA DE INFORMAÇÕES
**URL:** `https://elegant-wonder-production.up.railway.app/info.html`

**Arquivo:** `public/info.html`

**O que faz:**
- Informações técnicas
- URLs e credenciais

**Status:** ✅ Disponível, mas não necessário para Laila

---

## 🗑️ PÁGINAS ANTIGAS (Não usadas)

### 10. GAME-NEW
**Arquivo:** `public/invite/game-new.html`
**Status:** ❌ Não usado (versão antiga)

### 11. GAME-SIMPLE
**Arquivo:** `public/invite/game-simple.html`
**Status:** ❌ Não usado (versão antiga)

---

## 📋 RESUMO PARA ENVIAR PARA LAILA

### ✅ O QUE ELA PRECISA:

**1. Para Compartilhar:**
```
https://elegant-wonder-production.up.railway.app/heitor
```

**2. Para Gerenciar:**
```
https://elegant-wonder-production.up.railway.app/admin-laila
Senha: heitor123
```

---

## 🔗 TODAS AS ROTAS DO SERVIDOR

| Rota | Redireciona Para | Status |
|------|------------------|--------|
| `/` | `/heitor` | ✅ Ativo |
| `/heitor` | `public/invite/index.html` | ✅ Ativo |
| `/invite-heitor` | `/invite/index.html` | ✅ Ativo |
| `/admin-laila` | `/admin/dashboard.html` | ✅ Ativo |
| `/invite` | `/invite/index.html` | ✅ Ativo |
| `/invite/sequence` | `/invite/game-sequence.html` | ✅ Ativo |
| `/admin` | `/admin/dashboard.html` | ✅ Ativo |
| `/dashboard` | `/dashboard/login.html` | ✅ Ativo |
| `/info` | `/info.html` | ✅ Ativo |

---

**Última atualização:** 2025-01-XX

