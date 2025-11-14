# 📦 Como Instalar Dependências do Backend

## Opção 1: Usar Ambiente Virtual (Recomendado)

```bash
# 1. Ir para o diretório do backend
cd /home/maluquintela/terraviva/backend

# 2. Criar ambiente virtual (se não existir)
python3 -m venv venv

# 3. Ativar o ambiente virtual
source venv/bin/activate

# 4. Instalar dependências
pip install -r requirements.txt

# 5. Verificar instalação
python -c "import pytz; from openai import OpenAI; print('✅ Dependências OK!')"
```

## Opção 2: Instalar Globalmente (Menos Recomendado)

```bash
cd /home/maluquintela/terraviva/backend
pip3 install -r requirements.txt --break-system-packages
```

---

## ⚙️ Configurar API Key do OpenAI

Edite o arquivo `.env` no diretório `backend`:

```bash
# backend/.env
OPENAI_API_KEY=sk-proj-...sua_chave_aqui...
```

Para obter uma chave:
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Cole no arquivo `.env`

---

## 🚀 Iniciar o Backend

```bash
# Com ambiente virtual ativado:
cd /home/maluquintela/terraviva/backend
source venv/bin/activate  # Se usar venv
uvicorn main:app --reload --port 8003
```

---

## ✅ Testar o Sistema

### 1. Testar importações:
```bash
cd /home/maluquintela/terraviva/backend
python3 -c "
from ai_context import get_chatgpt_prompts
from regional_data import get_region_info
print('✅ Módulos OK!')
print('Dados de SP:', get_region_info('SP')['clima'])
"
```

### 2. Testar endpoint:
```bash
# Com o backend rodando, em outro terminal:
curl -X POST "http://localhost:8003/questions/" \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": 1,
    "question_text": "Como plantar tomate?",
    "sent_at": "2025-11-14T23:30:00.000Z"
  }'
```

---

## 📋 Dependências Principais

- ✅ **fastapi** - Framework web
- ✅ **openai** - API do ChatGPT
- ✅ **pytz** - Manipulação de fuso horário
- ✅ **sqlalchemy** - ORM para banco de dados
- ✅ **python-jose** - Autenticação JWT
- ✅ **passlib + bcrypt** - Hash de senhas
- ✅ **python-multipart** - Upload de arquivos
- ✅ **psycopg2-binary** - Driver PostgreSQL

---

## 🔍 Troubleshooting

### Erro: "No module named 'openai'"
```bash
pip install openai pytz
```

### Erro: "externally-managed-environment"
Use ambiente virtual (Opção 1 acima)

### Erro: "OPENAI_API_KEY not found"
Configure a chave no arquivo `.env`

### Backend não inicia
```bash
# Verificar portas em uso
lsof -i :8003

# Matar processo se necessário
kill -9 <PID>

# Tentar novamente
uvicorn main:app --reload --port 8003
```

---

## 🎉 Pronto!

Após instalar as dependências e configurar a API key, o sistema de contextualização estará funcionando completamente!


