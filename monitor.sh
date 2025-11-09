#!/bin/bash

# Script de Monitoramento do Servidor
# Verifica se o servidor está rodando e se os endpoints estão respondendo

echo "🔍 Monitorando Servidor..."
echo "================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se o servidor está rodando
PID=$(lsof -ti:3005)
if [ -z "$PID" ]; then
    echo -e "${RED}❌ Servidor NÃO está rodando na porta 3005${NC}"
    echo "Execute: npm start"
    exit 1
else
    echo -e "${GREEN}✅ Servidor rodando (PID: $PID)${NC}"
fi

echo ""
echo "Testando Endpoints:"
echo "-------------------"

# Teste 1: Health Check
echo -n "1. Health Check (/api/health): "
if curl -s http://localhost:3005/api/health > /dev/null; then
    echo -e "${GREEN}✅ OK${NC}"
    curl -s http://localhost:3005/api/health | jq -r '.message' 2>/dev/null || echo "Resposta recebida"
else
    echo -e "${RED}❌ FALHOU${NC}"
fi

# Teste 2: Página do Convite
echo -n "2. Página do Convite (/invite): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/invite/index.html)
if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK (HTTP $STATUS)${NC}"
else
    echo -e "${RED}❌ FALHOU (HTTP $STATUS)${NC}"
fi

# Teste 3: Mini-Jogo
echo -n "3. Mini-Jogo (/invite/game.html): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/invite/game.html)
if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK (HTTP $STATUS)${NC}"
else
    echo -e "${RED}❌ FALHOU (HTTP $STATUS)${NC}"
fi

# Teste 4: Admin Dashboard
echo -n "4. Admin Dashboard (/admin): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/admin/dashboard.html)
if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK (HTTP $STATUS)${NC}"
else
    echo -e "${RED}❌ FALHOU (HTTP $STATUS)${NC}"
fi

# Teste 5: API RSVP (sem dados, deve retornar erro de validação)
echo -n "5. API RSVP (/api/invite/rsvp): "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3005/api/invite/rsvp \
    -H "Content-Type: application/json" \
    -d '{}')
if [ "$STATUS" = "400" ] || [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✅ OK (HTTP $STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  Resposta inesperada (HTTP $STATUS)${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}📊 Status do Sistema:${NC}"
echo ""
echo "🌐 URLs Disponíveis:"
echo "   • Convite: http://localhost:3005/invite"
echo "   • Admin:   http://localhost:3005/admin"
echo "   • Health:  http://localhost:3005/api/health"
echo ""
echo "📁 Arquivo de Dados:"
if [ -f "data/rsvps.json" ]; then
    RSVP_COUNT=$(jq '. | length' data/rsvps.json 2>/dev/null || echo "0")
    echo -e "   ${GREEN}✅ data/rsvps.json existe ($RSVP_COUNT RSVPs)${NC}"
else
    echo -e "   ${YELLOW}⚠️  data/rsvps.json não existe (será criado automaticamente)${NC}"
fi
echo ""
echo "🔄 Para monitorar continuamente, execute:"
echo "   watch -n 5 ./monitor.sh"
echo ""

