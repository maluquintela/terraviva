# 🚜❤️ Feed Tipo Tinder - TerraViva

**Sistema de recomendações e matching para formar cooperativas**

---

## 🎯 Como Funciona

### 1. **Feed/Mercado (Tipo Tinder)**
- Mostra cards de produtores compatíveis
- Score de compatibilidade (0-100%)
- Baseado em: proximidade, produtos complementares, excedente

### 2. **Perfil Público**
- Informações completas do produtor
- Produtos disponíveis
- Histórico e bio

### 3. **Chat/DM (Conversar)**
- Clica em "Conversar" → Salva no chat
- Mensagens diretas entre produtores
- Histórico de conversas

### 4. **Formar Cooperativa**
- Após acordo no chat
- Criar cooperativa
- Convidar outros produtores

---

## 🔌 Novos Endpoints Criados

### Feed Tipo Tinder

**`GET /social/feed`**  
Recomendações personalizadas de produtores compatíveis

**Query Parameters:**
- `limit` (int, default: 10) - Quantos cards mostrar

**Response:**
```json
[
  {
    "farmer": {
      "id": 6,
      "name": "Maria Silva",
      "city": "Campina Grande",
      "state": "PB",
      "crops": "milho, feijão, mandioca",
      "production_weekly": "400 kg",
      "surplus": "100 kg"
    },
    "match_score": 85.0,
    "distance": "10-50 km",
    "products_in_common": ["milho", "feijão"],
    "can_complement": ["mandioca", "abóbora"],
    "highlight": "🔥 85% compatível! Match perfeito!",
    "reasons": [
      "Ambos na Paraíba (PB)",
      "Mesma cidade: Campina Grande",
      "2 produtos em comum",
      "Tem excedente disponível"
    ]
  }
]
```

### Perfil Público

**`GET /social/farmers/{farmer_id}/profile`**  
Visualizar perfil completo de um produtor

**Response:**
```json
{
  "farmer": { ...},
  "listings": [ ... ],
  "total_listings": 3,
  "member_since": "2025-11-13T...",
  "bio": "Maria Silva cultiva milho, feijão..."
}
```

### Chat/Mensagens

**`POST /social/messages/send`** 🔒  
Enviar mensagem direta

**Body:**
```json
{
  "receiver_id": 6,
  "content": "Olá! Gostaria de conversar sobre uma parceria."
}
```

**`GET /social/messages/conversations`** 🔒  
Listar todas as conversas (lista de chats)

**Response:**
```json
[
  {
    "conversation_id": 1,
    "other_farmer": { ... },
    "last_message": "Olá! Gostaria de conversar...",
    "last_message_at": "2025-11-13T...",
    "unread_count": 2
  }
]
```

**`GET /social/messages/with/{farmer_id}`** 🔒  
Ver mensagens com um agricultor específico

**Response:**
```json
{
  "other_farmer": { ... },
  "messages": [
    {
      "id": 1,
      "sender_id": 5,
      "receiver_id": 6,
      "content": "Olá!",
      "read": true,
      "created_at": "2025-11-13T..."
    }
  ],
  "total": 10
}
```

### Busca Avançada

**`GET /social/search`**  
Buscar agricultores e produtos

**Query Parameters:**
- `query` (string, required) - Termo de busca
- `filter_type` (string, optional) - "farmers", "products", "all"
- `city` (string, optional) - Filtrar por cidade
- `state` (string, optional) - Filtrar por estado

**Response:**
```json
{
  "farmers": [ ... ],
  "products": [ ... ],
  "listings": [ ... ]
}
```

---

## 💻 Como Usar no Frontend

### 1. Importar funções:

```javascript
import {
  fetchFeedRecommendations,
  fetchFarmerProfile,
  sendDirectMessage,
  fetchConversations,
  fetchMessagesWithFarmer,
  searchFarmersAndProducts
} from '../api/social';
```

### 2. Buscar Feed (Cards):

```javascript
const [cards, setCards] = useState([]);

useEffect(() => {
  const loadFeed = async () => {
    const recommendations = await fetchFeedRecommendations({ limit: 10 });
    setCards(recommendations);
  };
  loadFeed();
}, []);
```

### 3. Ver Perfil:

```javascript
const handleViewProfile = async (farmerId) => {
  const profile = await fetchFarmerProfile(farmerId);
  console.log(profile);
};
```

### 4. Iniciar Conversa (Conversar):

```javascript
const handleConversar = async (farmerId) => {
  await sendDirectMessage(
    farmerId,
    "Olá! Vi seu perfil e gostaria de conversar sobre parceria."
  );
  
  // Navegar para o chat
  navigate(`/chat/${farmerId}`);
};
```

### 5. Listar Conversas:

```javascript
const [conversations, setConversations] = useState([]);

useEffect(() => {
  const loadChats = async () => {
    const chats = await fetchConversations();
    setConversations(chats);
  };
  loadChats();
}, []);
```

### 6. Ver Mensagens:

```javascript
const [messages, setMessages] = useState([]);

useEffect(() => {
  const loadMessages = async () => {
    const data = await fetchMessagesWithFarmer(farmerId);
    setMessages(data.messages);
  };
  loadMessages();
}, [farmerId]);
```

---

## 🧪 Como Testar

### 1. Fazer Login

Use um dos usuários mockados:

```bash
# Via cURL
curl -X POST http://localhost:8003/farmers/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria.silva@terraviva.com","password":"senha123"}'
```

Copie o `access_token` retornado!

### 2. Ver Feed (Tipo Tinder)

```bash
TOKEN="seu_token_aqui"

curl http://localhost:8003/social/feed \
  -H "Authorization: Bearer $TOKEN"
```

Você verá uma lista de produtores compatíveis com scores!

### 3. Ver Perfil de um Produtor

```bash
curl http://localhost:8003/social/farmers/7/profile
```

### 4. Enviar Mensagem

```bash
curl -X POST http://localhost:8003/social/messages/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_id": 7,
    "content": "Olá! Gostaria de formar uma cooperativa com você."
  }'
```

### 5. Ver Conversas

```bash
curl http://localhost:8003/social/messages/conversations \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Ver Mensagens com Alguém

```bash
curl http://localhost:8003/social/messages/with/7 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👥 Usuários Mockados Disponíveis

| Nome | Email | Senha | Cidade | Produtos |
|------|-------|-------|--------|----------|
| Maria Silva | maria.silva@terraviva.com | senha123 | Campina Grande | milho, feijão, mandioca |
| João Pedro | joao.pedro@terraviva.com | senha123 | Campina Grande | tomate, pimentão, alface |
| Ana Costa | ana.costa@terraviva.com | senha123 | Areia | banana, maracujá, acerola |
| Carlos Santos | carlos.santos@terraviva.com | senha123 | Patos | milho, feijão, sorgo |
| Lúcia Oliveira | lucia.oliveira@terraviva.com | senha123 | Esperança | batata-doce, macaxeira, inhame |
| Roberto Lima | roberto.lima@terraviva.com | senha123 | Campina Grande | alface, couve, rúcula |
| Fernanda Ramos | fernanda.ramos@terraviva.com | senha123 | Bananeiras | banana, coco, laranja |
| Paulo Mendes | paulo.mendes@terraviva.com | senha123 | Queimadas | milho, feijão, abóbora |

---

## 🔥 Algoritmo de Compatibilidade

O score é calculado baseado em:

1. **Mesmo Estado** (+30 pontos) - "Ambos na Paraíba"
2. **Mesma Cidade** (+20 pontos) - "Mesma cidade: Campina Grande"
3. **Produtos em Comum** (+10 pontos por produto) - "2 produtos em comum"
4. **Produtos Complementares** (+5 pontos por produto, máx 30) - "Produtos para diversificar"
5. **Tem Excedente** (+10 pontos) - "Tem excedente disponível"

**Score máximo:** 100%

**Mensagens:**
- **80-100%:** "🔥 X% compatível! Match perfeito!"
- **60-79%:** "✨ X% compatível - Ótima opção!"
- **20-59%:** "👍 X% compatível"

---

## 📱 Componente React Exemplo

Veja o arquivo `FEED_TINDER_EXAMPLE.jsx` para um exemplo completo de:

- Feed estilo Tinder com cards
- Botões de ação (Próximo, Ver Perfil, Conversar)
- Modal de perfil completo
- Navegação para o chat

---

## 🎨 Fluxo Completo do Usuário

```
1. Login
   ↓
2. Ver Feed Tipo Tinder
   - Cards de produtores compatíveis
   - Score de match
   - Informações principais
   ↓
3. Ações no Card:
   a) "Próximo" → Ver próximo card
   b) "Ver Perfil" → Modal com info completa
   c) "Conversar" → Salva no chat + abre conversa
   ↓
4. Chat/DM
   - Lista de conversas ativas
   - Mensagens em tempo real
   - Histórico completo
   ↓
5. Formar Cooperativa
   - Após acordo no chat
   - Criar grupo
   - Convidar mais produtores
   ↓
6. Cooperativa Ativa
   - Feed de posts
   - Membros
   - Negociações
```

---

## 🚀 Próximos Passos

1. ✅ Feed tipo Tinder implementado
2. ✅ Chat/DM funcionando
3. ✅ Busca avançada
4. ⏳ Notificações de novas mensagens
5. ⏳ Sistema de "match" mútuo
6. ⏳ Recomendações baseadas em IA
7. ⏳ Upload de fotos de produtos
8. ⏳ Avaliações e reviews

---

## 📝 Tabelas do Banco de Dados

### `direct_messages`
- Mensagens diretas entre agricultores
- Marca se foi lida ou não
- Timestamp de criação

### `conversations`
- Agrupa mensagens entre dois agricultores
- Facilita listar conversas ativas
- Última mensagem timestamp

---

**Pronto para usar!** 🎉

Reinicie o backend e comece a testar o feed tipo Tinder!

```bash
# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8003
```

Acesse: **http://localhost:8003/docs**

Procure por **"social-tinder-chat"** nos endpoints! 🚜💚

