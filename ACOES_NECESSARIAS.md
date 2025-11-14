# ⚠️ AÇÕES NECESSÁRIAS - Reiniciar Servidores

**IMPORTANTE:** Para que as novas funcionalidades funcionem, você precisa **reiniciar os servidores**.

---

## 🔄 O QUE FOI ALTERADO

✅ **Backend:**
- Novos endpoints de posts de cooperativas adicionados
- Novos modelos de banco de dados criados
- Tabelas criadas no banco SQLite

✅ **Frontend:**
- Porta do backend corrigida (8000 → 8003)
- Novas funções de API adicionadas

---

## 🚨 PASSO A PASSO PARA APLICAR AS MUDANÇAS

### 1️⃣ Reiniciar o Backend

Se o backend estiver rodando:

1. **Vá para o terminal onde o backend está rodando**
2. **Pressione `Ctrl + C`** para parar o servidor
3. **Aguarde até o servidor parar completamente**
4. **Inicie novamente:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8003
```

**Você verá algo como:**
```
INFO:     Uvicorn running on http://0.0.0.0:8003 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ **Backend reiniciado com sucesso!**

---

### 2️⃣ Reiniciar o Frontend

Se o frontend estiver rodando:

1. **Vá para o terminal onde o frontend está rodando**
2. **Pressione `Ctrl + C`** para parar
3. **Aguarde até parar**
4. **Inicie novamente:**

```bash
npm start
```

**Aguarde compilar e abrir o navegador automaticamente**

✅ **Frontend reiniciado com sucesso!**

---

## ✅ VERIFICAÇÃO RÁPIDA

Após reiniciar ambos os servidores:

### Testar Backend:

```bash
# Testar se está respondendo
curl http://localhost:8003/health

# Deve retornar:
# {"status":"healthy","message":"TerraViva API está funcionando!"}
```

### Testar Novos Endpoints:

Acesse no navegador: **http://localhost:8003/docs**

Você deve ver os novos endpoints:
- `POST /marketplace/cooperatives/{cooperative_id}/posts`
- `GET /marketplace/cooperatives/{cooperative_id}/posts`
- `POST /marketplace/posts/{post_id}/comments`
- `GET /marketplace/posts/{post_id}/comments`
- `POST /marketplace/posts/{post_id}/like`
- `DELETE /marketplace/posts/{post_id}/like`
- `DELETE /marketplace/posts/{post_id}`

### Testar Frontend:

Acesse: **http://localhost:3000**

- Faça login
- Tente acessar qualquer funcionalidade
- **Verifique o Console do navegador (F12)** para ver se há erros de conexão

---

## 🐛 Se Algo Não Funcionar

### Backend não inicia:

```bash
# Verifique o ambiente virtual
cd backend
source venv/bin/activate
which python3

# Deve mostrar o caminho do venv
# .../backend/venv/bin/python3
```

### Frontend não conecta ao backend:

1. Verifique se o backend está rodando: http://localhost:8003/health
2. Verifique o console do navegador (F12) para erros
3. Limpe o cache do navegador: `Cmd + Shift + R` (Mac) ou `Ctrl + Shift + R` (Windows)

### Endpoints não aparecem no Swagger:

Isso significa que o backend não foi reiniciado. Repita o passo 1️⃣.

---

## 📋 CHECKLIST FINAL

Após reiniciar, verifique:

- [ ] Backend responde em http://localhost:8003/health
- [ ] Swagger mostra os novos endpoints em http://localhost:8003/docs
- [ ] Frontend abre em http://localhost:3000
- [ ] Login funciona normalmente
- [ ] Console do navegador não mostra erros de conexão
- [ ] Tabelas foram criadas no banco (verificado ✅)

---

## 🎯 PRÓXIMO PASSO

Após reiniciar os servidores com sucesso, você pode:

1. **Testar os novos endpoints** via Swagger UI
2. **Integrar o componente de feed** no frontend
3. **Seguir o tutorial** em `COMO_INICIAR.md`

---

## 📞 RESUMO RÁPIDO

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8003

# Terminal 2 - Frontend  
cd frontend2/terraviva
npm start

# Aguarde ambos iniciarem completamente
# Acesse: http://localhost:3000
```

---

✅ **Quando ambos os servidores estiverem rodando, as novas funcionalidades estarão disponíveis!**

---

**Dica:** Mantenha os dois terminais visíveis para monitorar logs e erros durante o desenvolvimento.

