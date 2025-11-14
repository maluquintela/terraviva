# 🌱 TerraViva

**Plataforma inteligente que conecta agricultores familiares a uma IA agrícola consultora e a um marketplace cooperativo**

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Documentação Completa](#-documentação-completa)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Contribuindo](#-contribuindo)

---

## 🎯 Visão Geral

O **TerraViva** é uma plataforma completa que democratiza o acesso à tecnologia agrícola para pequenos e médios produtores rurais brasileiros. A plataforma combina:

- 🤖 **Consultoria IA agrícola contextualizada** por região, clima, época do ano e orçamento
- 🛒 **Marketplace cooperativo** para escoamento de produção
- 💬 **Sistema de chat** para formação de cooperativas
- 📊 **Diagnóstico inteligente** que alimenta recomendações personalizadas

### Como Funciona

1. **Diagnóstico Inicial**: O produtor responde 3 telas de perguntas sobre localização, orçamento e objetivos comerciais
2. **IA Contextualizada**: A partir do diagnóstico, a IA oferece consultoria técnica adaptada à realidade do produtor
3. **Marketplace**: Produtores podem anunciar excedentes e buscar produtos complementares
4. **Cooperativas**: Sistema de match e chat para formação de cooperativas

---

## ✨ Funcionalidades Principais

### 🔐 1. Autenticação e Perfil
- Login JWT seguro com hash bcrypt
- Perfil automático gerado com base no diagnóstico
- Nome do usuário exibido em toda a aplicação ("Olá, {nome}")

### 📝 2. Diagnóstico em 3 Etapas
- **Tela 1 - Localização**: Cidade/estado → IA infere tipo de solo e clima
- **Tela 2 - Orçamento**: Valor mensal → IA limita recomendações ao orçamento real
- **Tela 3 - Interesses Comerciais**: Canal de venda e tipo de cooperação → IA adapta conselhos técnicos

### 🏠 3. Home
- **Assistência Técnica (Chatbot)**: Consultoria IA usando localização, solo, clima, orçamento e objetivos
- **Feed do Mercado**: Produtores no mesmo estado, ordenados por proximidade

### 🌾 4. Mercado (Marketplace)
- Busca por produtos filtrada por estado
- Perfil de produtores com excedentes disponíveis
- Sistema de favoritos e mensagens

### 👤 5. Perfil de Outros Produtores
- Ver detalhes da produção
- Favoritar produtores
- Enviar mensagens diretas
- Solicitar criação de cooperativa

### ✏️ 6. Meu Perfil
- Editar dados pessoais
- Gerenciar produtos em excesso
- Aceitar solicitações de cooperativa
- Ver produtores favoritados

### 🤝 7. Cooperativas (Sistema de Chat)
- **Chat Privado Individual**: Conversa 1-a-1 com outros produtores
- **Chat de Cooperativa (Grupo)**: Criado automaticamente ao aceitar solicitação
- **Administrador**: Quem enviou a primeira solicitação se torna admin do grupo
- Adicionar membros, gerenciar grupo

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React 19 + React Router + Context API + Tailwind CSS       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Páginas    │  │ Componentes  │  │   Context    │      │
│  │              │  │              │  │              │      │
│  │ - Home       │  │ - Layout     │  │ - AuthContext│      │
│  │ - Perfil     │  │ - Cards      │  │              │      │
│  │ - Mercado    │  │ - Modals     │  │              │      │
│  │ - Chat       │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│                    ⬇️ HTTP/REST ⬇️                            │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│              FastAPI + SQLAlchemy + JWT                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routers    │  │    Models    │  │     Auth     │      │
│  │              │  │              │  │              │      │
│  │ - farmers    │  │ - Farmer     │  │ - JWT        │      │
│  │ - questions  │  │ - Question   │  │ - Bcrypt     │      │
│  │ - marketplace│  │ - Listing    │  │ - Bearer     │      │
│  │ - social     │  │ - Message    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│                    ⬇️ SQL/ORM ⬇️                              │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│              SQLite (dev) / PostgreSQL (prod)                │
│                                                              │
│  Farmers | Questions | Listings | Cooperatives              │
│  Messages | Products | CooperativeRequests | ...            │
└─────────────────────────────────────────────────────────────┘
                             │
                    ⬅️ OpenAI API ⬅️
┌─────────────────────────────────────────────────────────────┐
│                      SERVIÇOS EXTERNOS                       │
│                                                              │
│  - OpenAI GPT-4o (Consultoria IA)                           │
│  - GPT-4o Vision (Análise de imagens)                       │
│  - Dados Regionais (Clima, Solo, Pragas)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Python 3.12+ 
- Node.js 18+ e npm
- Conta OpenAI (para IA consultiva)

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/terraviva.git
cd terraviva
```

### 2️⃣ Configurar Backend

```bash
# Navegar para a pasta do backend
cd terraviva/backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e adicione:
# - OPENAI_API_KEY=sua_chave_aqui
# - SECRET_KEY=sua_secret_key_jwt
# - DATABASE_URL=sqlite:///./bd_terraviva.db (ou PostgreSQL)
```

### 3️⃣ Configurar Frontend

```bash
# Navegar para a pasta do frontend
cd ../frontend2/terraviva

# Instalar dependências
npm install

# Configurar variáveis de ambiente (opcional)
# Crie .env com:
# REACT_APP_API_URL=http://localhost:8000
```

### 4️⃣ Executar o Projeto

**Terminal 1 - Backend:**
```bash
cd terraviva/backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8003
```

**Terminal 2 - Frontend:**
```bash
cd terraviva/frontend2/terraviva
npm start
```

Acesse:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8003/docs
- ReDoc: http://localhost:8003/redoc

---

## 📚 Documentação Completa

A documentação completa está organizada por módulos:

### 📖 Documentação por Módulo

| Módulo | Descrição | Link |
|--------|-----------|------|
| 🔐 **Autenticação** | Fluxo de login, JWT, perfil do usuário | [docs/AUTENTICACAO.md](docs/AUTENTICACAO.md) |
| 📝 **Diagnóstico** | 3 telas de diagnóstico e como alimentam o sistema | [docs/DIAGNOSTICO.md](docs/DIAGNOSTICO.md) |
| ⚙️ **Backend** | Rotas, models, schemas, lógica de negócio | [docs/BACKEND.md](docs/BACKEND.md) |
| 🗄️ **Banco de Dados** | Tabelas, relacionamentos, diagrama ER | [docs/DATABASE.md](docs/DATABASE.md) |
| 🎨 **Frontend** | Estrutura, componentes, hooks, páginas | [docs/FRONTEND.md](docs/FRONTEND.md) |
| 🌐 **API** | Exemplos de requisições e payloads | [docs/API.md](docs/API.md) |

### 🔍 Links Rápidos

- [Como funciona a autenticação e o perfil do usuário?](docs/AUTENTICACAO.md)
- [Como o diagnóstico alimenta o chatbot?](docs/DIAGNOSTICO.md#como-o-diagnóstico-alimenta-a-ia)
- [Como o feed do mercado filtra por estado?](docs/BACKEND.md#marketplace-feed)
- [Como criar uma cooperativa?](docs/DATABASE.md#fluxo-de-cooperativas)
- [Estrutura de pastas do frontend](docs/FRONTEND.md#estrutura-de-pastas)
- [Exemplos de chamadas à API](docs/API.md)

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **FastAPI** 0.119 - Framework web moderno e rápido
- **SQLAlchemy** 2.0 - ORM para Python
- **Pydantic** 2.12 - Validação de dados
- **Python-Jose** - JWT para autenticação
- **Passlib + Bcrypt** - Hash seguro de senhas
- **OpenAI** 2.7 - Integração com GPT-4
- **Python-Dotenv** - Gerenciamento de variáveis de ambiente
- **Uvicorn** - Servidor ASGI

### Frontend
- **React** 19.2 - Biblioteca UI
- **React Router** 7.9 - Roteamento
- **Tailwind CSS** 4.1 - Framework CSS utilitário
- **Lucide React** - Ícones
- **Class Variance Authority** - Variantes de componentes
- **React Context API** - Gerenciamento de estado global

### Banco de Dados
- **SQLite** - Desenvolvimento local
- **PostgreSQL** - Produção (Supabase recomendado)

### IA e Dados
- **OpenAI GPT-4o** - Consultoria agrícola inteligente
- **GPT-4o Vision** - Análise de imagens de plantações
- **Base de Dados Regionais** - Clima, solo, pragas por estado brasileiro

---

## 🎓 Conceitos-Chave do Sistema

### 🔄 Fluxo do Diagnóstico → IA

```
┌──────────────────┐
│ 1. DIAGNÓSTICO   │  Usuário preenche:
│                  │  - Cidade/Estado (PB, Patos)
│                  │  - Orçamento (R$ 100/mês)
│                  │  - Objetivos (venda direta, cooperação semanal)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. SALVO NO BD   │  Backend salva em farmer.diagnostic_profile
│                  │  E infere automaticamente:
│                  │  - Tipo de solo da região
│                  │  - Clima atual
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. IA USA DADOS  │  Quando usuário pergunta algo:
│                  │  IA recebe contexto completo:
│                  │  - Localização → Solo + Clima
│                  │  - Orçamento → Limita recomendações
│                  │  - Objetivos → Adapta conselhos
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. RESPOSTA      │  "Para milho em Patos/PB com orçamento
│   CONTEXTUALIZADA│   de R$100/mês e foco em venda direta..."
└──────────────────┘
```

### 🤝 Fluxo de Criação de Cooperativa

```
Produtor A                         Produtor B                    Sistema
    │                                  │                            │
    │─── Ver perfil de B ──────────────│                            │
    │                                  │                            │
    │─── Solicitar cooperativa ────────┼─────────────────────────►│
    │                                  │                            │
    │                                  │◄── Notificação ────────────│
    │                                  │                            │
    │                                  │─── Aceitar solicitação ───►│
    │                                  │                            │
    │◄──── Chat criado ────────────────┼────────────────────────────│
    │                                  │                            │
    │─── Conversa no chat ────────────►│                            │
    │                                  │                            │
    │─── A vira admin do grupo ────────┼────────────────────────────│
    │                                  │                            │
    │─── Adicionar Produtor C ─────────┼────────────────────────────│
```

---

## 🧪 Testando a API

Você pode testar a API diretamente pelo Swagger UI:

1. Inicie o backend: `uvicorn main:app --reload`
2. Acesse: http://localhost:8003/docs
3. Teste os endpoints interativamente

### Exemplo rápido com cURL:

```bash
# Login
curl -X POST "http://localhost:8003/farmers/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "teste.backend@terraviva.com", "password": "senha123"}'

# Fazer pergunta à IA
curl -X POST "http://localhost:8003/questions/" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "question_text=Como plantar milho?"
```

Veja mais exemplos em [docs/API.md](docs/API.md)

---

## 📊 Estrutura de Pastas

```
terraviva-4/
├── README.md                    # Este arquivo
├── docs/                        # Documentação completa
│   ├── AUTENTICACAO.md
│   ├── DIAGNOSTICO.md
│   ├── BACKEND.md
│   ├── DATABASE.md
│   ├── FRONTEND.md
│   └── API.md
├── terraviva/
│   ├── backend/                 # API FastAPI
│   │   ├── main.py             # Entry point
│   │   ├── auth.py             # Autenticação JWT
│   │   ├── ai_context.py       # Contexto para IA
│   │   ├── regional_data.py    # Dados por estado
│   │   ├── requirements.txt    # Dependências Python
│   │   └── routers/            # Rotas da API
│   │       ├── farmers.py
│   │       ├── questions.py
│   │       ├── marketplace.py
│   │       └── social.py
│   ├── database/               # Modelos do banco
│   │   ├── models.py          # SQLAlchemy models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── database.py        # Configuração do BD
│   └── frontend2/terraviva/   # App React
│       ├── src/
│       │   ├── api/           # Chamadas à API
│       │   ├── context/       # Context API
│       │   ├── componentes/   # Componentes UI
│       │   ├── screens/       # Páginas
│       │   └── App.js
│       └── package.json
```

---


## 📝 Variáveis de Ambiente

### Backend (.env)

```bash
# OpenAI (obrigatório para IA)
OPENAI_API_KEY=sk-proj-...

# JWT
SECRET_KEY=sua_secret_key_aqui_muito_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (opcional, padrão é SQLite)
DATABASE_URL=sqlite:///./bd_terraviva.db
# ou PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/terraviva
```

### Frontend (.env)

```bash
REACT_APP_API_URL=http://localhost:8003
```

---

## 🐛 Troubleshooting

### Backend não inicia

```bash
# Verificar se o venv está ativado
source venv/bin/activate

# Reinstalar dependências
pip install -r requirements.txt --force-reinstall

# Verificar se o Python é 3.12+
python --version
```

### Frontend não inicia

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar Node.js
node --version  # Deve ser 18+
```

### IA não responde

- Verifique se `OPENAI_API_KEY` está configurada no `.env`
- Verifique se há saldo na conta OpenAI
- Veja os logs do backend para mensagens de erro

---


---

## 👥 Autores

- **Equipe TerraViva** - Jullya Eloy, Luis Augusto Melo, Maria Luisa Quintela: Democratizando tecnologia agrícola no Brasil!



<div align="center">
  
  **🌱 TerraViva - Tecnologia que Cultiva Futuro 🌱**
  
  Inovando com quem alimenta o Brasil💚
  
</div>

