# 🎮 Sistema de Convites - Aniversário Heitor

## Visão Geral

Sistema interativo de convites temático Minecraft para o aniversário de 6 anos do Heitor. Inclui mini-jogo de mineração, formulário de RSVP e painel administrativo.

## 🚀 Como Usar

### 1. Acessar o Convite

- **URL Principal**: `http://localhost:3005/invite` ou `http://localhost:3005/invite/index.html`
- Compartilhe este link via WhatsApp com os pais dos amigos do Heitor

### 2. Fluxo do Usuário

1. **Página Inicial** (`/invite/index.html`)
   - Animação de introdução
   - Informações básicas da festa
   - Botão para iniciar o jogo

2. **Mini-Jogo** (`/invite/game.html`)
   - Grid de 5x5 blocos para minerar
   - Clique/tap nos blocos para quebrá-los
   - Um bloco contém o diamante com o convite completo
   - Após encontrar o diamante, formulário RSVP aparece

3. **Formulário RSVP**
   - Preenchimento de dados (criança, responsável, WhatsApp, confirmação)
   - Envio automático para o servidor
   - Mensagem de sucesso

### 3. Painel Administrativo

- **URL**: `http://localhost:3005/admin` ou `http://localhost:3005/admin/dashboard.html`
- **Senha Padrão**: `heitor2024` (pode ser alterada via variável de ambiente `ADMIN_PASSWORD`)

**Funcionalidades:**
- Visualizar todos os RSVPs
- Estatísticas (total, confirmados, talvez, não vão)
- Filtrar por status
- Buscar por nome
- Exportar para CSV
- Atualização automática a cada 30 segundos

## 📁 Estrutura de Arquivos

```
steve-bot-nene/
├── public/
│   ├── invite/
│   │   ├── index.html      # Página inicial do convite
│   │   ├── game.html       # Mini-jogo de mineração
│   │   ├── invite.css      # Estilos da página inicial
│   │   ├── invite.js       # Lógica da página inicial
│   │   ├── game.css        # Estilos do jogo
│   │   └── game.js         # Lógica do jogo e RSVP
│   └── admin/
│       ├── dashboard.html  # Painel administrativo
│       ├── admin.css       # Estilos do admin
│       └── admin.js         # Lógica do admin
├── data/
│   └── rsvps.json          # Armazenamento dos RSVPs (criado automaticamente)
└── server.js               # Servidor com APIs
```

## 🔌 API Endpoints

### POST `/api/invite/rsvp`
Submete um RSVP.

**Body:**
```json
{
  "childName": "João",
  "parentName": "Maria Silva",
  "whatsapp": "(34) 99999-9999",
  "confirmation": "yes",
  "notes": "Observações opcionais"
}
```

### GET `/api/invite/rsvps?password=senha`
Retorna todos os RSVPs (requer senha de admin).

### GET `/api/invite/stats?password=senha`
Retorna estatísticas (requer senha de admin).

### PUT `/api/invite/rsvp/:id?password=senha`
Atualiza status de um RSVP (requer senha de admin).

## 🎨 Personalização

### Alterar Informações da Festa

Edite os arquivos:
- `public/invite/index.html` - Informações na página inicial
- `public/invite/game.html` - Detalhes no card de convite

### Alterar Senha do Admin

Defina a variável de ambiente:
```bash
ADMIN_PASSWORD=sua_senha_aqui
```

Ou edite diretamente em `server.js` (linha 19).

## 📱 Compartilhamento via WhatsApp

O sistema está otimizado para compartilhamento via WhatsApp com:
- Open Graph metadata para preview rico
- Design responsivo para mobile
- Carregamento rápido
- Experiência touch-friendly

**Como compartilhar:**
1. Acesse `http://localhost:3005/invite` no navegador
2. Copie o link
3. Cole no WhatsApp e envie para os pais

## 🎮 Detalhes do Mini-Jogo

- **Grid**: 5x5 blocos (25 blocos total)
- **Mecânica**: Clique/tap para quebrar blocos
- **Objetivo**: Encontrar o bloco de diamante que revela o convite
- **Feedback**: 
  - Efeitos sonoros (quebrar bloco, encontrar diamante)
  - Partículas visuais
  - Barra de progresso
  - Animação de celebração

## 🔒 Segurança

- Senha simples para acesso ao admin (pode ser melhorada)
- Validação de inputs no cliente e servidor
- Sanitização de dados
- CORS configurado

## 🐛 Solução de Problemas

### RSVPs não aparecem no admin
- Verifique se o arquivo `data/rsvps.json` existe e tem permissões de escrita
- Verifique a senha do admin
- Veja os logs do servidor

### Sons não funcionam
- Alguns navegadores requerem interação do usuário antes de tocar áudio
- O áudio é inicializado no primeiro clique
- Verifique se o navegador suporta Web Audio API

### Link não abre no WhatsApp
- Certifique-se de que o servidor está rodando
- Use o link completo: `http://seu-ip:3005/invite`
- Para produção, use um domínio real

## 📊 Dados Armazenados

Cada RSVP contém:
- `id`: ID único
- `childName`: Nome da criança
- `parentName`: Nome do responsável
- `whatsapp`: Número de WhatsApp
- `confirmation`: "yes", "maybe" ou "no"
- `notes`: Observações opcionais
- `timestamp`: Data/hora do envio
- `status`: Status interno (pending, etc.)

## 🚀 Deploy

Para produção:
1. Configure variável de ambiente `ADMIN_PASSWORD`
2. Configure domínio real para Open Graph metadata
3. Adicione imagem de preview (og:image) se desejar
4. Configure HTTPS para melhor segurança
5. Considere usar banco de dados real em vez de JSON para muitos RSVPs

## 📝 Notas

- O sistema foi projetado para ser simples e funcional
- Pode ser facilmente expandido com mais funcionalidades
- O design é otimizado para crianças de 6 anos
- Totalmente responsivo para mobile e desktop

---

**Desenvolvido com ❤️ para o aniversário do Heitor! 🎉**
