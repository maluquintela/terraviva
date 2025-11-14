# 🚀 Como Iniciar o TerraViva com as Novas Funcionalidades

**Última atualização:** 13 de Novembro de 2025

---

## ⚡ Início Rápido

### 1️⃣ Iniciar o Backend

```bash
cd /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/backend

# Ativar ambiente virtual
source venv/bin/activate

# Iniciar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8003
```

✅ Backend rodando em: **http://localhost:8003**  
📚 Documentação da API: **http://localhost:8003/docs**

---

### 2️⃣ Iniciar o Frontend

**Em outro terminal:**

```bash
cd /Users/luisaugustomelodequeirozoliveira/terraviva-3/terraviva/frontend2/terraviva

# Instalar dependências (se necessário)
npm install

# Iniciar servidor de desenvolvimento
npm start
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 🔍 Verificar se Está Funcionando

### Backend:

```bash
# Testar health check
curl http://localhost:8003/health

# Deve retornar:
# {"status":"healthy","message":"TerraViva API está funcionando!"}
```

### Novos Endpoints de Posts:

```bash
# Ver documentação interativa
open http://localhost:8003/docs

# Ou buscar por "cooperative" nos endpoints
```

---

## 🧪 Testar as Novas Funcionalidades

### Passo 1: Fazer Login

```bash
curl -X POST http://localhost:8003/farmers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste.backend@terraviva.com",
    "password": "senha123"
  }'
```

**Copie o `access_token` retornado!**

### Passo 2: Criar uma Cooperativa (se não existir)

```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:8003/marketplace/cooperatives \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cooperativa Teste",
    "main_product": "Feijão",
    "description": "Cooperativa para testes"
  }'
```

### Passo 3: Adicionar-se como Membro

```bash
curl -X POST http://localhost:8003/marketplace/cooperatives/1/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": 5,
    "cooperative_id": 1
  }'
```

### Passo 4: Criar um Post

```bash
curl -X POST http://localhost:8003/marketplace/cooperatives/1/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Olá pessoal! Este é meu primeiro post na cooperativa! 🌱🚜"
  }'
```

### Passo 5: Listar Posts

```bash
curl http://localhost:8003/marketplace/cooperatives/1/posts
```

### Passo 6: Curtir um Post

```bash
curl -X POST http://localhost:8003/marketplace/posts/1/like \
  -H "Authorization: Bearer $TOKEN"
```

### Passo 7: Comentar em um Post

```bash
curl -X POST http://localhost:8003/marketplace/posts/1/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Ótimo post! Parabéns! 👏"
  }'
```

---

## 📱 Usar no Frontend

### No componente React:

```javascript
import React, { useEffect, useState } from 'react';
import { fetchCooperativePosts } from '../api/marketplace';

function CooperativaFeed({ cooperativeId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchCooperativePosts(cooperativeId);
        setPosts(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    loadPosts();
  }, [cooperativeId]);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.farmer.name}</h3>
          <p>{post.content}</p>
          <p>❤️ {post.likes_count} curtidas</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🛠️ Troubleshooting

### ❌ Erro: "Connection refused" na porta 8003

**Solução:** Backend não está rodando. Inicie com:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8003
```

### ❌ Erro: "Cooperativa não encontrada"

**Solução:** Crie uma cooperativa primeiro usando o endpoint `POST /marketplace/cooperatives`

### ❌ Erro: "Você precisa ser membro desta cooperativa"

**Solução:** Adicione-se como membro usando o endpoint `POST /marketplace/cooperatives/{id}/members`

### ❌ Erro no Frontend: "Failed to fetch"

**Solução:** Verifique se:
1. Backend está rodando na porta 8003
2. Frontend está configurado para a porta correta (já foi corrigido no `client.js`)

### ❌ Endpoints novos não aparecem no Swagger

**Solução:** Reinicie o servidor do backend. As mudanças só são carregadas quando o servidor inicia.

---

## 📚 Documentação Adicional

- **API Completa:** `DOCUMENTACAO_POSTS_COOPERATIVAS.md`
- **Exemplo de Componente:** `EXEMPLO_COMPONENTE_POSTS.jsx`
- **Resumo da Implementação:** `RESUMO_IMPLEMENTACAO.md`

---

## ✅ Checklist Pré-Inicialização

- [ ] Backend rodando na porta 8003
- [ ] Frontend rodando na porta 3000
- [ ] Banco de dados SQLite existe em `/database/bd_terraviva.db`
- [ ] Tabelas de posts criadas (cooperative_posts, post_comments, post_likes)
- [ ] Usuário de teste existe e consegue fazer login
- [ ] Pelo menos uma cooperativa criada

---

## 🎯 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/farmers/login` | Fazer login (obter token) |
| GET | `/marketplace/cooperatives` | Listar cooperativas |
| POST | `/marketplace/cooperatives/{id}/posts` | Criar post 🆕 |
| GET | `/marketplace/cooperatives/{id}/posts` | Listar posts 🆕 |
| POST | `/marketplace/posts/{id}/comments` | Comentar 🆕 |
| GET | `/marketplace/posts/{id}/comments` | Ver comentários 🆕 |
| POST | `/marketplace/posts/{id}/like` | Curtir 🆕 |
| DELETE | `/marketplace/posts/{id}/like` | Descurtir 🆕 |
| DELETE | `/marketplace/posts/{id}` | Deletar post 🆕 |

🆕 = Novos endpoints implementados hoje

---

## 💡 Dicas

1. **Use o Swagger UI** (http://localhost:8003/docs) para testar rapidamente
2. **Copie o exemplo de componente** (`EXEMPLO_COMPONENTE_POSTS.jsx`) e adapte
3. **Consulte a documentação** (`DOCUMENTACAO_POSTS_COOPERATIVAS.md`) para detalhes
4. **Mantenha os dois terminais abertos** (backend e frontend) durante o desenvolvimento

---

**Pronto para usar!** 🚀🌱

Se tiver dúvidas, consulte os arquivos de documentação ou acesse o Swagger UI.

