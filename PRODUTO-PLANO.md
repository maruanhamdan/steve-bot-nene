# 🚀 PLANO DE PRODUTO - InviteManager Pro

## 📊 ANÁLISE DO PROJETO ATUAL

### ✅ O que já temos (MVP Funcional)
- ✅ 2 jogos interativos (Minerador Pro + Sequência Master)
- ✅ Sistema de RSVP completo
- ✅ Admin dashboard básico
- ✅ Leaderboard competitivo
- ✅ Design responsivo e moderno
- ✅ Sistema de pontuação
- ✅ Deploy em produção (Railway)

### 🎯 O QUE PRECISAMOS PARA VIRAR PRODUTO

## 1. SISTEMA DE CONTAS E USUÁRIOS

### 1.1 Conta PRO (Criadores)
- **Quem**: Pais/responsáveis que criam convites
- **O que**: Dashboard para gerenciar múltiplos convites
- **Como**: Sistema de autenticação simples (email + senha)
- **Onde**: `/dashboard` ou `/creator`

### 1.2 Modelo de Tokens
- **1 Convite = 1 Token**
- **Pacotes**: 
  - 5 tokens = R$ 9,90 (R$ 1,98/convite)
  - 15 tokens = R$ 24,90 (R$ 1,66/convite)
  - 50 tokens = R$ 69,90 (R$ 1,40/convite)
- **Assinatura Mensal**: R$ 19,90/mês = 10 convites

### 1.3 Funcionalidades PRO
- Criar múltiplos convites
- Personalizar tema, cores, textos
- Ver estatísticas de cada convite
- Exportar dados (CSV)
- Gerenciar convidados

## 2. SISTEMA DE CRIAÇÃO DE CONVITES

### 2.1 Wizard de Criação
1. **Informações Básicas**
   - Nome da criança
   - Idade
   - Data e horário
   - Local
   - Tema (Minecraft, Super Heróis, Princesas, etc.)

2. **Personalização**
   - Escolher jogo (Minerador Pro ou Sequência Master)
   - Cores personalizadas
   - Mensagem personalizada

3. **Preview e Publicação**
   - Ver como ficará
   - Gerar link único
   - Compartilhar

### 2.2 Link Único por Convite
- Formato: `invitemanager.pro/i/{invite-id}`
- Cada convite tem ID único
- Estatísticas separadas por convite

## 3. DASHBOARD DO CRIADOR

### 3.1 Visão Geral
- Total de convites criados
- Tokens disponíveis
- Convites ativos
- RSVPs recebidos (total)

### 3.2 Gerenciamento de Convites
- Lista de todos os convites
- Status (rascunho, ativo, finalizado)
- Ações: Editar, Ver, Compartilhar, Estatísticas

### 3.3 Estatísticas por Convite
- Total de acessos
- RSVPs recebidos
- Confirmações (Sim/Talvez/Não)
- Leaderboard do jogo
- Tempo médio de jogo

## 4. MELHORIAS TÉCNICAS

### 4.1 Banco de Dados
- Migrar de JSON para SQLite (simples) ou PostgreSQL
- Tabelas: users, invites, rsvps, leaderboard, tokens

### 4.2 Autenticação
- Sistema simples: email + senha
- JWT tokens para sessão
- Recuperação de senha (futuro)

### 4.3 API Melhorada
- Endpoints RESTful organizados
- Versionamento: `/api/v1/`
- Rate limiting básico

## 5. MONETIZAÇÃO

### 5.1 Gateway de Pagamento
- **Stripe** (internacional) ou **Mercado Pago** (Brasil)
- Checkout simples
- Webhook para confirmar pagamento

### 5.2 Sistema de Tokens
- Tokens comprados = créditos na conta
- 1 convite criado = 1 token consumido
- Histórico de transações

## 6. UX/UI MELHORADA

### 6.1 Landing Page
- Página inicial profissional
- Demonstração do produto
- Preços e planos
- Depoimentos (futuro)

### 6.2 Onboarding
- Tutorial para novos usuários
- Exemplo de convite
- Guia rápido

### 6.3 Branding
- Logo profissional
- Cores consistentes
- Tipografia moderna

## 7. DOCUMENTAÇÃO

### 7.1 Para Usuários
- Guia de uso
- FAQ
- Vídeos tutoriais (futuro)

### 7.2 Para Desenvolvedores
- API documentation
- Roadmap
- Changelog

## 8. MARKETING E CRESCIMENTO

### 8.1 Funcionalidades de Viralização
- Compartilhamento otimizado (WhatsApp, Instagram)
- Preview cards bonitos
- CTA para outros pais

### 8.2 Programa de Indicação
- "Indique um amigo, ganhe tokens"
- Código de desconto

## 📋 PRIORIZAÇÃO (MVP → PRODUTO)

### FASE 1: ESSENCIAL (Para Laila usar AGORA)
1. ✅ Sistema de contas básico (email + senha)
2. ✅ Dashboard do criador
3. ✅ Sistema de criação de convites (wizard)
4. ✅ Link único por convite
5. ✅ Gerenciamento de múltiplos convites

### FASE 2: MONETIZAÇÃO
1. Sistema de tokens
2. Gateway de pagamento
3. Histórico de transações

### FASE 3: MELHORIAS
1. Banco de dados estruturado
2. Personalização avançada
3. Analytics melhorado

### FASE 4: ESCALA
1. Landing page profissional
2. Marketing automation
3. Programa de indicação

---

## 🎯 OBJETIVO FINAL

**Transformar em plataforma SaaS onde:**
- Pais criam convites interativos em minutos
- Crianças se divertem descobrindo o convite
- Criadores gerenciam tudo em um dashboard
- Monetização simples e transparente

**Diferencial:**
- Único no mercado com jogos interativos
- Experiência gamificada para crianças
- Fácil de usar para pais
- Preço acessível

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar sistema de contas
2. Criar dashboard do criador
3. Wizard de criação de convites
4. Sistema de tokens básico
5. Melhorar UX/UI geral

