# 🚀 Guia Rápido - Steve Bot

## Como Rodar o Projeto

1. **Instalar dependências** (apenas na primeira vez):
```bash
npm install
```

2. **Iniciar o servidor**:
```bash
npm start
```

3. **Abrir no navegador**:
```
http://localhost:3000
```

## ✅ O que foi implementado

### Interface
- ✅ Design moderno e colorido
- ✅ Avatar do Steve (personagem do Minecraft)
- ✅ Chat responsivo e animado
- ✅ Botões grandes e fáceis de usar

### Funcionalidades de Voz
- ✅ Reconhecimento de voz (fala para texto)
- ✅ Síntese de voz (Steve responde falando)
- ✅ Botão do microfone com animação
- ✅ Feedback visual quando está ouvindo

### Inteligência Artificial
- ✅ Integrado com Z.AI API (GLM-4.6)
- ✅ Prompts especializados em Minecraft
- ✅ Conhecimento sobre builds, crafting, mobs, biomas
- ✅ Respostas adaptadas para crianças de 6 anos

### Segurança
- ✅ Filtro de conteúdo inapropriado
- ✅ Lista de palavras bloqueadas
- ✅ Respostas de redirecionamento amigáveis
- ✅ Foco apenas em Minecraft e temas infantis

## 🎮 Como Usar

### Para o Sobrinho
1. Clique no botão **vermelho** (microfone)
2. Fale a pergunta quando aparecer "Estou te ouvindo"
3. O Steve vai responder **falando**!

### Exemplos de Perguntas
- "Como faço uma espada de diamante?"
- "Qual armadura é mais forte?"
- "Como construir uma casa?"
- "O que fazer no Nether?"
- "Como derrotar o Ender Dragon?"

## 🛠️ Tecnologias Usadas

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **IA**: Z.AI API (GLM-4.6 - Anthropic Compatible)
- **Voz**: Web Speech API (nativa do navegador)

## 📁 Estrutura de Arquivos

```
steve-bot-nene/
├── server.js          # Servidor backend + API
├── package.json       # Dependências
├── .env              # Configurações da API
└── public/           # Frontend
    ├── index.html    # Interface
    ├── styles.css    # Estilos
    └── app.js        # Lógica (voz + chat)
```

## 🔧 Solução Rápida de Problemas

### Microfone não funciona?
- Use **Chrome** ou **Edge**
- Dê permissão ao navegador
- Verifique se nenhum outro app está usando o mic

### Steve não responde?
- Confirme que o servidor está rodando
- Verifique o console (F12) para erros
- Teste a conexão: http://localhost:3000/api/health

### Voz não sai?
- Aumente o volume
- Clique na página antes (alguns navegadores bloqueiam áudio automático)
- Teste em outro navegador

## 🎯 Próximos Passos (Melhorias Futuras)

- [ ] Adicionar imagens de itens e builds
- [ ] Histórico de conversas
- [ ] Modo escuro
- [ ] Sistema de "favoritos" para builds
- [ ] Tutorial interativo passo-a-passo
- [ ] Avatares customizáveis
- [ ] Mais vozes disponíveis
- [ ] Exportar conversas para PDF

## 📞 Suporte

Se tiver problemas, verifique:
1. Node.js instalado (v18+)
2. Porta 3000 disponível
3. Configurações no `.env` estão corretas
4. Internet conectada (para API Z.AI)

---

**Divirta-se! 🎮⛏️**
