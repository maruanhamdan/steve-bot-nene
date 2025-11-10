# 📚 DOCUMENTAÇÃO COMPLETA - PRODUÇÃO

## 🌐 Ambiente de Produção

### URL Base
**https://elegant-wonder-production.up.railway.app**

### Plataforma
- **Serviço**: Railway.app
- **Tipo**: Web Service (Node.js)
- **Status**: ✅ ATIVO EM PRODUÇÃO

---

## 🎯 Páginas Disponíveis em Produção

### 1. Página Principal com Vídeo
**URL**: `/heitor`
- Vídeo do Steve
- Botão "DESCUBRIR O CONVITE" que leva para `/invite`
- **Uso**: Link principal para compartilhar

### 2. Página de Escolha de Jogos
**URL**: `/invite` ou `/invite/index.html`
- Apresentação do convite
- Botões para escolher jogo:
  - ⛏️ MINERADOR PRO
  - 🎯 SEQUÊNCIA MASTER
- Informações da festa

### 3. Confirmação Rápida (SEM JOGOS)
**URL**: `/confirmar` ou `/rsvp`
- Vídeo do Steve
- Formulário RSVP direto
- **Uso**: Para confirmações rápidas sem jogar
- **Ideal**: Enviar para pessoas que querem confirmar rápido

### 4. Jogo Minerador Pro
**URL**: `/invite/game.html`
- Grid 4x4 de blocos
- Encontrar diamante revela convite
- Sistema de pontuação e leaderboard
- Formulário RSVP integrado

### 5. Jogo Sequência Master
**URL**: `/invite/game-sequence.html`
- Jogo de memória (sequência de cores)
- 10 níveis progressivos
- Sistema de pontuação e leaderboard
- Formulário RSVP integrado

### 6. Painel Admin (Laila)
**URL**: `/admin-laila` ou `/admin/dashboard.html`
- **Senha**: `heitor123`
- Visualizar todos os RSVPs
- Estatísticas (Total, Confirmados, Não)
- Buscar e filtrar
- Exportar CSV

---

## 🔐 Credenciais e Segurança

### Admin Password
- **Senha**: `heitor123`
- **Localização**: Variável de ambiente `ADMIN_PASSWORD` no Railway
- **Acesso**: Apenas `/admin-laila` e `/admin/dashboard.html`

### Variáveis de Ambiente (Railway)
```
ADMIN_PASSWORD=heitor123
ANTHROPIC_BASE_URL=<URL da API>
ANTHROPIC_AUTH_TOKEN=<Token>
ANTHROPIC_MODEL=<Modelo>
JWT_SECRET=<Secret para JWT>
PORT=3005 (automático no Railway)
```

---

## 📊 Sistema de Dados

### Arquivos de Dados
Localizados em: `/data/` (no servidor Railway)

1. **`rsvps.json`** - Todas as confirmações de presença
2. **`users.json`** - Usuários do sistema PRO (futuro)
3. **`invites.json`** - Convites criados (futuro)
4. **`leaderboard.json`** - Rankings dos jogos

### Estrutura de RSVP
```json
{
  "id": "uuid",
  "inviteId": null,
  "childName": "Nome da criança",
  "parentName": "Nome do responsável",
  "whatsapp": "WhatsApp",
  "confirmation": "yes" | "no",
  "notes": null,
  "timestamp": "ISO string"
}
```

---

## 🚀 Como Funciona o Deploy

### Plataforma: Railway.app

#### 1. Configuração
- **Arquivo**: `railway.json`
- **Builder**: NIXPACKS (detecta automaticamente Node.js)
- **Start Command**: `npm start`
- **Restart Policy**: ON_FAILURE (máximo 10 tentativas)

#### 2. Processo de Deploy
1. **Push para GitHub** → Railway detecta mudanças
2. **Build automático** → Instala dependências (`npm install`)
3. **Deploy** → Inicia servidor (`npm start`)
4. **Health Check** → Railway verifica se está rodando

#### 3. Monitoramento
- Logs disponíveis no dashboard Railway
- Restart automático em caso de falha
- URL pública: `https://elegant-wonder-production.up.railway.app`

---

## 🔄 Fluxo de Funcionamento

### Para Convidados (Crianças/Pais)

1. **Recebem link**: `/heitor` ou `/confirmar`
2. **Veem vídeo**: Apresentação do convite
3. **Escolhem**:
   - **Opção 1**: Jogar (`/invite` → escolher jogo)
   - **Opção 2**: Confirmar direto (`/confirmar`)
4. **Preenchem formulário**:
   - Convidado (nome da criança)
   - Responsável (nome do pai/mãe)
   - Contato (WhatsApp)
   - Confirmação (SIM/NÃO)
5. **Envio**: Dados salvos em `data/rsvps.json`

### Para Laila (Admin)

1. **Acessa**: `/admin-laila`
2. **Login**: Senha `heitor123`
3. **Visualiza**:
   - Total de RSVPs
   - Confirmados
   - Não vão
   - Lista completa
4. **Ações**:
   - Buscar por nome
   - Filtrar (Todos/Confirmados/Não)
   - Exportar CSV
   - Copiar informações

---

## 📱 Integração WhatsApp

### Open Graph Tags
Todas as páginas têm meta tags para preview no WhatsApp:
- Título
- Descrição
- Imagem (futuro)
- URL

### Compartilhamento
- Link direto funciona perfeitamente
- Preview automático no WhatsApp
- Design responsivo para mobile

---

## 🛡️ Segurança e Boas Práticas

### Implementado
✅ Senha admin não está em placeholder
✅ Validação de formulários
✅ Sanitização de dados
✅ CORS configurado
✅ Rate limiting (futuro)

### Recomendações
- Manter senha admin segura
- Não commitar `.env`
- Fazer backup dos dados periodicamente
- Monitorar logs no Railway

---

## 📈 Estatísticas e Métricas

### Dados Coletados
- Total de RSVPs
- Confirmados vs Não
- Timestamp de cada confirmação
- Nome do convidado e responsável
- Contato (WhatsApp)

### Acesso
- Via painel admin (`/admin-laila`)
- Exportável em CSV
- Filtros disponíveis

---

## 🔧 Manutenção

### Backup de Dados
- Arquivos em `/data/` no servidor Railway
- Recomendado: Backup periódico manual ou automático

### Atualizações
1. Fazer mudanças localmente
2. Testar em ambiente local
3. Commit e push para GitHub
4. Railway faz deploy automático
5. Verificar se está funcionando

### Logs
- Acessar dashboard Railway
- Ver logs em tempo real
- Identificar erros rapidamente

---

## ⚠️ IMPORTANTE - NÃO MEXER EM PRODUÇÃO

### Regras
- ❌ **NUNCA** alterar código diretamente em produção
- ❌ **NUNCA** alterar dados manualmente em produção
- ✅ **SEMPRE** testar localmente primeiro
- ✅ **SEMPRE** fazer deploy via Git (push → Railway)

### Ambiente de Desenvolvimento
- Use ambiente local para testes
- Veja `DESENVOLVIMENTO-LOCAL.md` para setup
- Teste tudo antes de fazer deploy

---

## 📞 Suporte e Contatos

### URLs Importantes
- **Produção**: https://elegant-wonder-production.up.railway.app
- **Railway Dashboard**: https://railway.app
- **GitHub**: Repositório do projeto

### Documentação Relacionada
- `DESENVOLVIMENTO-LOCAL.md` - Setup local
- `DEPLOY.md` - Guia de deploy
- `README.md` - Visão geral
- `TODAS-PAGINAS.md` - Lista de páginas

---

**Última atualização**: 2025-01-10
**Status**: ✅ PRODUÇÃO ATIVA E FUNCIONANDO


