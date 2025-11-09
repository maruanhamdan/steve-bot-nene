#!/bin/bash

# Script de Deploy Automatizado
# Prepara tudo para deploy em Railway/Render/Vercel

set -e

echo "🚀 PREPARANDO DEPLOY AUTOMÁTICO"
echo "================================"
echo ""

# Verificar se está em repositório Git
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório Git..."
    git init
    echo "✅ Git inicializado"
fi

# Verificar se tem remote
if ! git remote | grep -q origin; then
    echo ""
    echo "⚠️  ATENÇÃO: Repositório não tem remote configurado"
    echo ""
    echo "Para fazer deploy automático:"
    echo "1. Crie um repositório no GitHub"
    echo "2. Execute:"
    echo "   git remote add origin https://github.com/SEU_USUARIO/steve-bot-nene.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
fi

# Verificar testes
echo "🧪 Executando testes..."
if ./test-deploy.sh http://localhost:3005 > /dev/null 2>&1; then
    echo "✅ Todos os testes passaram"
else
    echo "⚠️  Alguns testes falharam - verifique antes de fazer deploy"
    echo "   Execute: ./test-deploy.sh para ver detalhes"
fi

# Verificar arquivos necessários
echo ""
echo "📋 Verificando arquivos de configuração..."
FILES=("vercel.json" "railway.json" "render.yaml" "package.json" "server.js")
MISSING=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (FALTANDO)"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "❌ Alguns arquivos estão faltando!"
    exit 1
fi

# Verificar variáveis de ambiente
echo ""
echo "🔐 Verificando variáveis de ambiente necessárias..."
ENV_VARS=("ANTHROPIC_BASE_URL" "ANTHROPIC_AUTH_TOKEN" "ANTHROPIC_MODEL")
MISSING_ENV=0

if [ -f ".env" ]; then
    for var in "${ENV_VARS[@]}"; do
        if grep -q "^$var=" .env; then
            echo "  ✅ $var"
        else
            echo "  ⚠️  $var (não encontrado no .env)"
        fi
    done
else
    echo "  ⚠️  Arquivo .env não encontrado"
    echo "  📝 Crie um arquivo .env com as variáveis necessárias"
fi

# Status do Git
echo ""
echo "📊 Status do Git:"
if git diff --quiet && git diff --cached --quiet; then
    echo "  ✅ Nenhuma mudança pendente"
else
    echo "  📝 Mudanças não commitadas:"
    git status --short | head -10
    echo ""
    echo "  💡 Execute: git add -A && git commit -m 'Preparado para deploy'"
fi

echo ""
echo "================================"
echo "✅ PREPARAÇÃO CONCLUÍDA!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Railway (RECOMENDADO):"
echo "   → Acesse: https://railway.app"
echo "   → New Project → Deploy from GitHub"
echo "   → Selecione este repositório"
echo "   → Adicione variáveis de ambiente"
echo ""
echo "2. Render:"
echo "   → Acesse: https://render.com"
echo "   → New Web Service"
echo "   → Conecte GitHub → Selecione repo"
echo "   → Adicione variáveis de ambiente"
echo ""
echo "3. Vercel:"
echo "   → npm i -g vercel"
echo "   → vercel login"
echo "   → vercel"
echo ""
echo "📖 Veja DEPLOY.md para instruções detalhadas"
echo ""

