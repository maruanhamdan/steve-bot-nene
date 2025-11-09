# 🎮 Steve - Assistente Virtual de Minecraft

Steve é um assistente virtual inteligente criado especialmente para ajudar crianças a aprender sobre Minecraft de forma divertida e segura!

## 🌟 Características

- 🎤 **Reconhecimento de Voz**: Seu sobrinho pode falar com o Steve usando o microfone
- 🔊 **Respostas em Áudio**: Steve responde falando, perfeito para crianças que ainda não leem bem
- 🤖 **IA Avançada**: Integrado com Z.AI (GLM-4.6) para respostas inteligentes
- 🛡️ **Filtro de Conteúdo**: Bloqueia automaticamente conteúdo inapropriado
- ⛏️ **Especialista em Minecraft**: Conhece builds, crafting, mobs, biomas e muito mais
- 🎨 **Design Moderno**: Interface limpa, colorida e fácil de usar

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Navegador moderno (Chrome ou Edge recomendado para melhor suporte a voz)

### Instalação

1. **Instalar dependências**
```bash
npm install
```

2. **Iniciar o servidor**
```bash
npm start
```

3. **Abrir no navegador**
```
http://localhost:3000
```

## 📱 Como Usar

### Para Crianças (Modo Simples)
1. **Falar com Steve**: Clique no botão vermelho do microfone e fale sua pergunta
2. **Escrever**: Ou digite na caixa de texto e clique no botão verde de enviar
3. **Ouvir**: Steve vai responder falando! 🔊

### Exemplos de Perguntas
- "Como faço uma espada de diamante?"
- "Qual é a melhor build para sobreviver?"
- "Como derrotar o Ender Dragon?"
- "O que eu faço no Nether?"
- "Como construir uma casa segura?"

## 🛡️ Segurança

Steve possui múltiplas camadas de proteção:
- ✅ Filtra palavras e tópicos inapropriados
- ✅ Responde apenas sobre Minecraft e temas apropriados para crianças
- ✅ Redireciona perguntas inadequadas de forma amigável
- ✅ Sistema de IA configurado especificamente para público infantil

## 🔧 Configuração da API Z.AI

As configurações já estão no arquivo `.env`:
```env
ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic
ANTHROPIC_AUTH_TOKEN=a1b0ec2671f246ad8cccc3440e2cbf89.axlWCIyrWxp5fIPW
ANTHROPIC_MODEL=glm-4.6
PORT=3000
```

## 📁 Estrutura do Projeto

```
steve-bot-nene/
├── server.js              # Servidor backend (Express + Z.AI)
├── package.json           # Dependências do projeto
├── .env                   # Configurações (API keys)
├── .gitignore            # Arquivos ignorados pelo Git
└── public/               # Frontend
    ├── index.html        # Interface principal
    ├── styles.css        # Estilos modernos
    └── app.js            # Lógica do cliente (voz + chat)
```

## 🎯 Funcionalidades Implementadas (MVP)

✅ Interface moderna e amigável para crianças
✅ Reconhecimento de voz (Speech-to-Text)
✅ Síntese de voz (Text-to-Speech)
✅ Integração com Z.AI API (GLM-4.6)
✅ Filtro de conteúdo inapropriado
✅ Sistema de chat inteligente
✅ Prompts especializados em Minecraft
✅ Design responsivo (funciona em tablets e celulares)

## 🚧 Próximas Melhorias (Futuro)

- 🖼️ Mostrar imagens de builds e itens
- 📊 Histórico de conversas
- 🎮 Modo escuro
- 🏆 Sistema de conquistas
- 📚 Tutoriais interativos passo-a-passo
- 🌍 Suporte para outros idiomas
- 👥 Perfis de usuário
- 🎨 Personalizações visuais

## 🐛 Solução de Problemas

### O microfone não funciona
- Certifique-se de dar permissão de microfone ao navegador
- Use Chrome ou Edge (melhor suporte)
- Verifique se outro aplicativo não está usando o microfone

### Steve não responde
- Verifique se o servidor está rodando (`npm start`)
- Confirme que as configurações da API Z.AI estão corretas no `.env`
- Veja o console do navegador (F12) para erros

### A voz não sai
- Verifique o volume do computador
- Teste em outro navegador
- Alguns navegadores bloqueiam áudio automático - clique na página primeiro

## 📝 Notas Importantes

- **Compatibilidade de Voz**: Reconhecimento de voz funciona melhor no Chrome e Edge
- **Conexão Internet**: Necessária para a API Z.AI
- **Microfone**: Necessário para função de voz (mas pode usar apenas texto também)

## 🎉 Divirta-se!

Steve está pronto para ajudar seu sobrinho a se tornar um mestre do Minecraft! 🎮⛏️

---

**Desenvolvido com ❤️ para pequenos gamers**
