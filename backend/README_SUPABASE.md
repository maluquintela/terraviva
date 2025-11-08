# 🗄️ Configuração do Supabase com SQLAlchemy

Este guia explica como conectar o backend TerraViva ao Supabase (PostgreSQL) usando SQLAlchemy.

## 📋 Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase

## 🔧 Passos de Configuração

### 1. Instalar Dependências

```bash
cd backend
pip install -r requirements.txt
```

Isso instalará o `psycopg2-binary`, que é o driver necessário para PostgreSQL.

### 2. Obter Credenciais do Supabase

No painel do Supabase:

1. Acesse **Settings** → **Database**
2. Na seção **Connection string**, copie a **URI** no formato:
   ```
   postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres
   ```

3. Substitua `[SUA-SENHA]` pela senha do banco de dados

4. Também anote:
   - **Project URL** (API URL): `https://[seu-projeto].supabase.co`
   - **API Key** (anon/public): encontrada em **Settings** → **API**

### 3. Criar Arquivo .env

Crie um arquivo `.env` na pasta raiz do projeto (`/home/maluquintela/terraviva/.env`):

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica-anon-key

# Database URL (PostgreSQL do Supabase)
DATABASE_URL=postgresql://postgres:sua-senha@db.seu-projeto.supabase.co:5432/postgres

# OpenAI API Key (para IA consultora)
OPENAI_API_KEY=sua-chave-openai

# JWT Secret (para autenticação)
SECRET_KEY=sua-chave-secreta-aqui

# Environment
ENVIRONMENT=development
```

⚠️ **Importante**: Nunca commit o arquivo `.env` no Git! Ele já está no `.gitignore`.

### 4. Criar as Tabelas no Supabase

Execute o script de criação:

```bash
cd backend
python create_tables.py
```

Ou via Python interativo:

```python
from database import Base, engine
import models

Base.metadata.create_all(bind=engine)
```

### 5. Verificar no Supabase

1. Acesse o painel do Supabase
2. Vá em **Table Editor**
3. Você deve ver as seguintes tabelas:
   - `farmers`
   - `questions`
   - `products`
   - `listings`
   - `cooperatives`
   - `cooperative_memberships`

### 6. Iniciar o Servidor

```bash
cd backend
uvicorn main:app --reload
```

Acesse a documentação da API em: http://localhost:8000/docs

## 📁 Estrutura de Arquivos Modificados

```
backend/
├── database.py         # ✅ Atualizado para usar PostgreSQL
├── models.py          # ✅ Modelos já compatíveis com PostgreSQL
├── requirements.txt   # ✅ Adicionado psycopg2-binary
├── create_tables.py   # ✅ Novo script para criar tabelas
└── main.py           # ✅ Já carrega o DATABASE_URL
```

## 🔍 Diferenças entre SQLite e PostgreSQL

| Aspecto | SQLite | PostgreSQL (Supabase) |
|---------|--------|----------------------|
| Conexão | Arquivo local | URL remota |
| Thread safety | `check_same_thread=False` | Não necessário |
| Pool de conexões | Não usado | `pool_size` e `max_overflow` |
| Tipos de dados | Limitados | Completos (com arrays, JSON, etc.) |
| Produção | ❌ Não recomendado | ✅ Pronto para produção |

## 🎯 Vantagens do Supabase

- ✅ **Escalável**: Suporta múltiplos usuários simultâneos
- ✅ **Backup automático**: Dados seguros
- ✅ **API REST e GraphQL**: Geradas automaticamente
- ✅ **Autenticação**: Sistema integrado
- ✅ **Storage**: Para arquivos de áudio das perguntas
- ✅ **Real-time**: Atualizações em tempo real

## 🐛 Troubleshooting

### Erro: "could not connect to server"
- Verifique se a URL do banco está correta
- Confirme que a senha está correta
- Verifique sua conexão com a internet

### Erro: "psycopg2 not found"
```bash
pip install psycopg2-binary
```

### Erro: "permission denied for schema public"
- Certifique-se de estar usando a senha correta do banco
- No Supabase, vá em Database → Settings e redefina a senha se necessário

## 📚 Próximos Passos

1. Configurar autenticação JWT
2. Implementar upload de áudio no Supabase Storage
3. Adicionar índices para otimização de queries
4. Configurar Row Level Security (RLS) no Supabase

## 🔗 Links Úteis

- [Documentação SQLAlchemy](https://docs.sqlalchemy.org/)
- [Documentação Supabase](https://supabase.com/docs)
- [Guia PostgreSQL + Python](https://www.psycopg.org/docs/)

