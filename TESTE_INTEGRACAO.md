# 🧪 Guia de Testes - Integração Backend + Frontend TerraViva

## ✅ Status do Backend
- **Porta:** 8000
- **Health Check:** http://localhost:8000/health
- **Documentação:** http://localhost:8000/docs
- **Banco de Dados:** /database/bd_terraviva.db (SQLite)

---

## 📋 Roteiro de Testes

### 1️⃣ TESTE DE CADASTRO E LOGIN

#### Backend (via curl):
```bash
# Criar novo agricultor
curl -X POST http://localhost:8000/farmers/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Integração",
    "email": "teste.backend@terraviva.com",
    "password": "senha123",
    "region": "Sertão",
    "city": "Campina Grande",
    "state": "PB",
    "crops": "milho, feijão",
    "budget": 1500,
    "production_weekly": "200 kg",
    "surplus": "50 kg",
    "sale_preference": "direta",
    "contact": "(83) 99999-0000"
  }'

# Fazer login
curl -X POST http://localhost:8000/farmers/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=teste@integracao.com&password=senha123"
```

#### Frontend:
1. Abrir http://localhost:3000
2. Clicar em "Cadastre-se"
3. Preencher o formulário
4. Após cadastro, fazer login
5. Verificar redirecionamento para /home

---

### 2️⃣ TESTE DE DIAGNÓSTICO

#### Backend:
```bash
# Submeter diagnóstico (precisa do token JWT)
TOKEN="seu_token_aqui"

curl -X POST http://localhost:8000/farmers/1/diagnose \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "city": "Campina Grande",
    "state": "PB",
    "crops": "milho, feijão, mandioca",
    "budget": 2000,
    "production_weekly": "300 kg de milho",
    "surplus": "100 kg de milho",
    "sale_preference": "institucional",
    "contact": "(83) 99999-1111"
  }'
```

#### Frontend:
1. Após login, ir para /diagnostico
2. Preencher as 6 etapas do wizard
3. Verificar mensagem de sucesso
4. Confirmar redirecionamento para /home

---

### 3️⃣ TESTE DO CHATBOT (OpenAI)

#### Backend:
```bash
# Fazer pergunta à IA
curl -X POST http://localhost:8000/questions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "farmer_id": 1,
    "question_text": "Como combater pragas no milho de forma orgânica?"
  }'
```

#### Frontend:
1. Na home, clicar em "Ajuda Técnica" ou acessar /chatbot
2. Digitar uma pergunta sobre agricultura
3. Verificar resposta da IA
4. Testar várias perguntas

**⚠️ IMPORTANTE:** Verificar se a variável `OPENAI_API_KEY` está configurada no backend!

---

### 4️⃣ TESTE DO MARKETPLACE

#### Backend - Criar produtos e anúncios:
```bash
# 1. Criar um produto
curl -X POST http://localhost:8000/marketplace/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Milho Orgânico",
    "category": "cereais",
    "unit": "kg",
    "description": "Milho cultivado sem agrotóxicos",
    "price": 5.50,
    "quantity": 500
  }'

# 2. Criar um anúncio (listing)
curl -X POST http://localhost:8000/marketplace/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "farmer_id": 1,
    "product_id": 1,
    "quantity_total": 200,
    "price": 5.00,
    "city": "Campina Grande",
    "state": "PB"
  }'

# 3. Listar todos os anúncios
curl -X GET "http://localhost:8000/marketplace/listings?status=disponível"

# 4. Buscar no marketplace
curl -X GET "http://localhost:8000/marketplace/search?query=milho"
```

#### Frontend:
1. Na home, clicar em "Mercado"
2. Verificar se os anúncios aparecem
3. Clicar em "Ver detalhes do anúncio"
4. Testar a busca com filtros
5. Clicar em "Entrar em contato com o produtor"

---

### 5️⃣ TESTE DE COOPERATIVAS

#### Backend - Criar cooperativa:
```bash
# 1. Criar cooperativa
curl -X POST http://localhost:8000/marketplace/cooperatives \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Cooperativa Milho Paraíba",
    "main_product": "Milho Orgânico",
    "description": "Produtores de milho orgânico da região de Campina Grande"
  }'

# 2. Entrar na cooperativa
curl -X POST http://localhost:8000/marketplace/cooperatives/1/join \
  -H "Authorization: Bearer $TOKEN"

# 3. Listar cooperativas
curl -X GET http://localhost:8000/marketplace/cooperatives
```

#### Frontend:
1. Na home, clicar em "Cooperativas"
2. Ver aba "Produtores" (anúncios de outros agricultores)
3. Ver aba "Cooperativas" (grupos)
4. Clicar em uma conversa
5. Testar envio de mensagens (ainda mock, mas interface deve funcionar)

---

### 6️⃣ TESTE DE PERFIL DO USUÁRIO

#### Backend:
```bash
# Obter perfil atual
curl -X GET http://localhost:8000/farmers/me \
  -H "Authorization: Bearer $TOKEN"

# Atualizar perfil
curl -X PUT http://localhost:8000/farmers/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "contact": "(83) 98888-7777",
    "budget": 2500
  }'
```

#### Frontend:
1. Clicar no botão "Meu perfil" no marketplace ou cooperativas
2. Verificar dados carregados
3. (Se implementado) Editar informações

---

## 🔍 Verificações no Banco de Dados

```bash
# Ver todos os farmers cadastrados
sqlite3 /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/database/bd_terraviva.db \
  "SELECT id, name, email, city, state FROM farmers;"

# Ver produtos criados
sqlite3 /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/database/bd_terraviva.db \
  "SELECT * FROM products;"

# Ver anúncios ativos
sqlite3 /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/database/bd_terraviva.db \
  "SELECT l.id, f.name as farmer, p.name as product, l.quantity_total, l.price, l.city, l.state 
   FROM listings l 
   JOIN farmers f ON l.farmer_id = f.id 
   JOIN products p ON l.product_id = p.id;"

# Ver perguntas feitas ao chatbot
sqlite3 /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/database/bd_terraviva.db \
  "SELECT id, farmer_id, question_text, created_at FROM questions ORDER BY created_at DESC LIMIT 5;"
```

---

## 🐛 Checklist de Problemas Comuns

- [ ] Backend não sobe: Verificar porta 8000 livre
- [ ] Frontend não conecta: Verificar `REACT_APP_API_URL` em .env
- [ ] Erro 401 (Unauthorized): Token JWT expirado ou inválido
- [ ] Chatbot não responde: Verificar `OPENAI_API_KEY` no backend
- [ ] CORS error: Verificar configuração em `backend/main.py`
- [ ] Dados não salvam: Verificar permissões do arquivo `database/bd_terraviva.db`

---

## 📊 Métricas de Sucesso

✅ **Cadastro funciona**: Novo usuário criado no banco
✅ **Login funciona**: Token JWT retornado e armazenado
✅ **Diagnóstico salvo**: Bio gerada automaticamente
✅ **Chatbot responde**: Resposta da OpenAI recebida
✅ **Marketplace carrega**: Anúncios exibidos corretamente
✅ **Cooperativas listadas**: Grupos e produtores visíveis
✅ **Rotas protegidas**: Redirecionamento para login sem token

---

## 🚀 Como Iniciar os Servidores

### Backend:
```bash
cd /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend:
```bash
cd /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/frontend2/terraviva
npm start
```

Abrir http://localhost:3000 no navegador.

