#!/bin/bash

# Script de Teste Completo para Deploy
# Testa todos os endpoints e funcionalidades

set -e

echo "🧪 TESTE COMPLETO DO SISTEMA"
echo "============================"
echo ""

BASE_URL="${1:-http://localhost:3005}"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_status=$5
    
    echo -n "Testando $name... "
    
    if [ "$method" = "GET" ]; then
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    else
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$url")
    fi
    
    if [ "$STATUS" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS (HTTP $STATUS)${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL (HTTP $STATUS, esperado $expected_status)${NC}"
        ((FAILED++))
        return 1
    fi
}

echo "1. Testando Health Check..."
test_endpoint "Health Check" "GET" "/api/health" "" "200"

echo ""
echo "2. Testando Páginas Estáticas..."
test_endpoint "Página do Convite" "GET" "/invite/index.html" "" "200"
test_endpoint "Mini-Jogo" "GET" "/invite/game.html" "" "200"
test_endpoint "Admin Dashboard" "GET" "/admin/dashboard.html" "" "200"

echo ""
echo "3. Testando API RSVP..."
test_endpoint "RSVP - Validação (sem dados)" "POST" "/api/invite/rsvp" "{}" "400"
test_endpoint "RSVP - Sucesso" "POST" "/api/invite/rsvp" '{
    "childName": "Teste",
    "parentName": "Pai Teste",
    "whatsapp": "(34) 99999-9999",
    "confirmation": "yes"
}' "200"

echo ""
echo "4. Testando Admin API (sem senha)..."
test_endpoint "Admin RSVPs (sem auth)" "GET" "/api/invite/rsvps" "" "401"
test_endpoint "Admin Stats (sem auth)" "GET" "/api/invite/stats" "" "401"

echo ""
echo "5. Testando Admin API (com senha)..."
ADMIN_PASS="${ADMIN_PASSWORD:-heitor2024}"
test_endpoint "Admin RSVPs (com auth)" "GET" "/api/invite/rsvps?password=$ADMIN_PASS" "" "200"
test_endpoint "Admin Stats (com auth)" "GET" "/api/invite/stats?password=$ADMIN_PASS" "" "200"

echo ""
echo "============================"
echo "📊 RESULTADO:"
echo -e "   ${GREEN}✅ Passou: $PASSED${NC}"
echo -e "   ${RED}❌ Falhou: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo ""
    echo "✅ Sistema pronto para deploy!"
    exit 0
else
    echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
    echo ""
    echo "Verifique os erros acima antes de fazer deploy."
    exit 1
fi
