# 🚀 IMPLEMENTAÇÃO - InviteManager Pro

## FASE 1: ESSENCIAL (Para Laila usar AGORA)

### ✅ Checklist de Implementação

#### 1. Sistema de Contas
- [ ] Modelo de dados: users.json
- [ ] API: POST /api/auth/register (criar conta)
- [ ] API: POST /api/auth/login (login)
- [ ] API: GET /api/auth/me (verificar sessão)
- [ ] Frontend: Página de login/registro
- [ ] JWT simples para sessão

#### 2. Sistema de Convites
- [ ] Modelo de dados: invites.json
- [ ] Estrutura: { id, userId, childName, age, date, time, location, theme, gameType, createdAt, status }
- [ ] API: POST /api/invites (criar)
- [ ] API: GET /api/invites (listar do usuário)
- [ ] API: GET /api/invites/:id (detalhes)
- [ ] API: PUT /api/invites/:id (editar)
- [ ] API: DELETE /api/invites/:id (deletar)

#### 3. Link Único
- [ ] Rota: GET /i/:inviteId
- [ ] Carregar dados do convite dinamicamente
- [ ] Renderizar página com dados do convite

#### 4. Dashboard do Criador
- [ ] Página: /dashboard
- [ ] Lista de convites criados
- [ ] Estatísticas por convite
- [ ] Botão "Criar Novo Convite"

#### 5. Wizard de Criação
- [ ] Página: /dashboard/create
- [ ] Step 1: Informações básicas
- [ ] Step 2: Escolher jogo
- [ ] Step 3: Preview
- [ ] Step 4: Publicar

#### 6. Migração de Dados
- [ ] Converter convite atual do Heitor para novo formato
- [ ] Manter compatibilidade com URLs antigas

---

## ESTRUTURA DE DADOS

### users.json
```json
[
  {
    "id": "user_123",
    "email": "laila@email.com",
    "password": "hash",
    "name": "Laila",
    "tokens": 10,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

### invites.json
```json
[
  {
    "id": "inv_abc123",
    "userId": "user_123",
    "childName": "Heitor",
    "age": 6,
    "date": "2025-12-17",
    "time": "19:00-22:00",
    "location": "Blue Moon - Av Oscarina Cunha Chaves, 112 - Copacabana, Uberlândia - MG",
    "theme": "Minecraft",
    "gameType": "minerador",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

### rsvps.json (atualizado)
```json
[
  {
    "id": "rsvp_123",
    "inviteId": "inv_abc123",
    "childName": "João",
    "parentName": "Maria",
    "whatsapp": "(34) 99999-9999",
    "confirmation": "yes",
    "timestamp": "2025-01-01T00:00:00Z"
  }
]
```

---

## PRÓXIMOS PASSOS

1. Implementar autenticação básica
2. Criar estrutura de dados
3. Migrar convite atual
4. Criar dashboard
5. Wizard de criação

