# 📱 Documentação: Rede Social de Cooperativas

**Data:** 13 de Novembro de 2025  
**Funcionalidade:** Posts, Comentários e Curtidas em Cooperativas

---

## 🎯 Visão Geral

Foi implementado um sistema completo de rede social para cooperativas, permitindo que membros possam:
- ✅ Criar posts/publicações
- ✅ Comentar em posts
- ✅ Curtir posts
- ✅ Ver feed de posts da cooperativa

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:

#### 1. `cooperative_posts`
Armazena as publicações nas cooperativas.

```sql
CREATE TABLE cooperative_posts (
    id INTEGER PRIMARY KEY,
    cooperative_id INTEGER NOT NULL,  -- ID da cooperativa
    farmer_id INTEGER NOT NULL,       -- ID do autor
    content TEXT NOT NULL,            -- Conteúdo do post
    image_url VARCHAR(255),           -- URL da imagem (opcional)
    likes_count INTEGER DEFAULT 0,   -- Contador de curtidas
    created_at DATETIME,              -- Data de criação
    updated_at DATETIME,              -- Data de atualização
    FOREIGN KEY(cooperative_id) REFERENCES cooperatives (id),
    FOREIGN KEY(farmer_id) REFERENCES farmers (id)
);
```

#### 2. `post_comments`
Armazena comentários em posts.

```sql
CREATE TABLE post_comments (
    id INTEGER PRIMARY KEY,
    post_id INTEGER NOT NULL,        -- ID do post
    farmer_id INTEGER NOT NULL,      -- ID do autor do comentário
    content TEXT NOT NULL,           -- Conteúdo do comentário
    created_at DATETIME,             -- Data de criação
    FOREIGN KEY(post_id) REFERENCES cooperative_posts (id),
    FOREIGN KEY(farmer_id) REFERENCES farmers (id)
);
```

#### 3. `post_likes`
Armazena curtidas em posts.

```sql
CREATE TABLE post_likes (
    id INTEGER PRIMARY KEY,
    post_id INTEGER NOT NULL,        -- ID do post
    farmer_id INTEGER NOT NULL,      -- ID de quem curtiu
    created_at DATETIME,             -- Data da curtida
    FOREIGN KEY(post_id) REFERENCES cooperative_posts (id),
    FOREIGN KEY(farmer_id) REFERENCES farmers (id)
);
```

---

## 🔌 Endpoints da API

### 1️⃣ Criar Post em Cooperativa

**Endpoint:** `POST /marketplace/cooperatives/{cooperative_id}/posts`  
**Autenticação:** ✅ Requerida (JWT Token)  
**Permissão:** Apenas membros da cooperativa

**Request:**
```json
{
  "content": "Pessoal, consegui fechar uma ótima venda de 500kg de feijão! 🎉",
  "image_url": "https://exemplo.com/imagem.jpg"  // opcional
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "cooperative_id": 5,
  "farmer_id": 10,
  "content": "Pessoal, consegui fechar uma ótima venda de 500kg de feijão! 🎉",
  "image_url": "https://exemplo.com/imagem.jpg",
  "likes_count": 0,
  "created_at": "2025-11-13T10:30:00",
  "updated_at": null,
  "farmer": {
    "id": 10,
    "name": "João Silva",
    "email": "joao@example.com",
    ...
  },
  "comments_count": 0
}
```

**Erros:**
- `404` - Cooperativa não encontrada
- `403` - Não é membro da cooperativa
- `401` - Não autenticado

---

### 2️⃣ Listar Posts de uma Cooperativa

**Endpoint:** `GET /marketplace/cooperatives/{cooperative_id}/posts`  
**Autenticação:** ❌ Não requerida  
**Query Parameters:**
- `skip` (int, default: 0) - Número de posts para pular
- `limit` (int, default: 20) - Limite de posts por página

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "cooperative_id": 5,
    "farmer_id": 8,
    "content": "Nova reunião marcada para sexta-feira!",
    "image_url": null,
    "likes_count": 5,
    "created_at": "2025-11-13T11:00:00",
    "updated_at": null,
    "farmer": {
      "id": 8,
      "name": "Maria Santos",
      ...
    },
    "comments_count": 3
  },
  ...
]
```

---

### 3️⃣ Comentar em um Post

**Endpoint:** `POST /marketplace/posts/{post_id}/comments`  
**Autenticação:** ✅ Requerida (JWT Token)  
**Permissão:** Apenas membros da cooperativa

**Request:**
```json
{
  "content": "Parabéns pela venda! 🎊"
}
```

**Response (201 Created):**
```json
{
  "id": 15,
  "post_id": 2,
  "farmer_id": 10,
  "content": "Parabéns pela venda! 🎊",
  "created_at": "2025-11-13T11:05:00",
  "farmer": {
    "id": 10,
    "name": "João Silva",
    ...
  }
}
```

---

### 4️⃣ Listar Comentários de um Post

**Endpoint:** `GET /marketplace/posts/{post_id}/comments`  
**Autenticação:** ❌ Não requerida  
**Query Parameters:**
- `skip` (int, default: 0)
- `limit` (int, default: 50)

**Response (200 OK):**
```json
[
  {
    "id": 15,
    "post_id": 2,
    "farmer_id": 10,
    "content": "Parabéns pela venda! 🎊",
    "created_at": "2025-11-13T11:05:00",
    "farmer": {
      "id": 10,
      "name": "João Silva",
      ...
    }
  },
  ...
]
```

---

### 5️⃣ Curtir um Post

**Endpoint:** `POST /marketplace/posts/{post_id}/like`  
**Autenticação:** ✅ Requerida (JWT Token)

**Response (200 OK):**
```json
{
  "message": "Post curtido com sucesso",
  "likes_count": 6
}
```

**Erros:**
- `400` - Você já curtiu este post
- `404` - Post não encontrado

---

### 6️⃣ Descurtir um Post

**Endpoint:** `DELETE /marketplace/posts/{post_id}/like`  
**Autenticação:** ✅ Requerida (JWT Token)

**Response (200 OK):**
```json
{
  "message": "Curtida removida com sucesso",
  "likes_count": 5
}
```

**Erros:**
- `404` - Você não curtiu este post / Post não encontrado

---

### 7️⃣ Deletar um Post

**Endpoint:** `DELETE /marketplace/posts/{post_id}`  
**Autenticação:** ✅ Requerida (JWT Token)  
**Permissão:** Apenas o autor do post

**Response (200 OK):**
```json
{
  "message": "Post deletado com sucesso"
}
```

**Nota:** Todos os comentários e curtidas do post são deletados automaticamente (cascade).

---

## 💻 Como Usar no Frontend

### Importar as funções:

```javascript
import {
  createCooperativePost,
  fetchCooperativePosts,
  createPostComment,
  fetchPostComments,
  likePost,
  unlikePost,
  deletePost
} from "../api/marketplace";
```

### Exemplo 1: Criar um Post

```javascript
// Dentro de um componente React
const handleCreatePost = async () => {
  try {
    const newPost = await createCooperativePost(cooperativeId, {
      content: "Olá pessoal! Nova atualização aqui 🌱",
      image_url: "https://exemplo.com/foto.jpg" // opcional
    });
    
    console.log("Post criado:", newPost);
    // Atualizar lista de posts...
  } catch (error) {
    console.error("Erro ao criar post:", error);
    alert(error.message);
  }
};
```

### Exemplo 2: Buscar Posts da Cooperativa

```javascript
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadPosts = async () => {
    try {
      const data = await fetchCooperativePosts(cooperativeId, {
        skip: 0,
        limit: 20
      });
      setPosts(data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  loadPosts();
}, [cooperativeId]);
```

### Exemplo 3: Curtir/Descurtir Post

```javascript
const [liked, setLiked] = useState(false);
const [likesCount, setLikesCount] = useState(post.likes_count);

const handleToggleLike = async () => {
  try {
    if (liked) {
      const response = await unlikePost(post.id);
      setLikesCount(response.likes_count);
      setLiked(false);
    } else {
      const response = await likePost(post.id);
      setLikesCount(response.likes_count);
      setLiked(true);
    }
  } catch (error) {
    console.error("Erro ao curtir:", error);
  }
};
```

### Exemplo 4: Adicionar Comentário

```javascript
const [comment, setComment] = useState("");

const handleSubmitComment = async (e) => {
  e.preventDefault();
  
  if (!comment.trim()) return;
  
  try {
    const newComment = await createPostComment(post.id, {
      content: comment
    });
    
    // Adicionar comentário à lista
    setComments([...comments, newComment]);
    setComment(""); // Limpar campo
  } catch (error) {
    console.error("Erro ao comentar:", error);
  }
};
```

---

## 🧪 Como Testar

### 1. Testar pelo Swagger (Recomendado)

1. Acesse: http://localhost:8003/docs
2. Faça login para obter o token JWT
3. Clique em "Authorize" e cole o token
4. Teste os endpoints na ordem:
   - Criar um post
   - Listar posts
   - Comentar no post
   - Curtir o post
   - Listar comentários

### 2. Testar pelo cURL

```bash
# 1. Fazer login e pegar o token
TOKEN=$(curl -X POST http://localhost:8003/farmers/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste.backend@terraviva.com","password":"senha123"}' \
  | jq -r '.access_token')

# 2. Criar um post (assumindo cooperative_id = 1)
curl -X POST http://localhost:8003/marketplace/cooperatives/1/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Meu primeiro post na cooperativa! 🚜"}'

# 3. Listar posts
curl http://localhost:8003/marketplace/cooperatives/1/posts

# 4. Curtir post (assumindo post_id = 1)
curl -X POST http://localhost:8003/marketplace/posts/1/like \
  -H "Authorization: Bearer $TOKEN"

# 5. Comentar no post
curl -X POST http://localhost:8003/marketplace/posts/1/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Ótimo post! 👏"}'
```

---

## ✅ Status da Implementação

- ✅ Modelos de banco de dados criados
- ✅ Schemas de validação criados
- ✅ Endpoints da API implementados
- ✅ Funções do frontend criadas
- ✅ Tabelas do banco criadas
- ⏳ Interface do usuário (pendente - precisa ser integrado)

---

## 🔄 Próximos Passos

1. **Criar componentes React** para exibir o feed de posts
2. **Adicionar notificações** quando alguém comenta ou curte seus posts
3. **Implementar paginação infinita** no feed
4. **Adicionar upload de imagens** para os posts
5. **Criar filtros** (por data, autor, etc.)

---

## 📝 Notas Importantes

- ⚠️ **Apenas membros da cooperativa** podem criar posts e comentar
- ⚠️ **Apenas o autor** pode deletar seus próprios posts
- ⚠️ Posts deletados **removem automaticamente** todos os comentários e curtidas
- ✅ Qualquer pessoa pode **visualizar** posts e comentários (não precisa autenticação)
- ✅ Sistema de **curtidas único** - não pode curtir o mesmo post duas vezes

---

## 🐛 Troubleshooting

### Erro 403: "Você precisa ser membro desta cooperativa"
**Solução:** O usuário precisa estar cadastrado como membro da cooperativa. Use o endpoint de membership para adicionar.

### Erro 400: "Você já curtiu este post"
**Solução:** O sistema não permite curtir o mesmo post duas vezes. Use o endpoint DELETE para descurtir primeiro.

### Token expirado (401)
**Solução:** Faça login novamente. Os tokens JWT expiram após 30 minutos.

---

**Documentação gerada automaticamente pelo sistema TerraViva** 🌱

