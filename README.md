# TerraViva

**An intelligent platform that connects family farmers to an AI agricultural advisor and a cooperative marketplace**

[![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Installation and Setup](#installation-and-setup)
- [Test Credentials](#5-test-credentials)
- [Full Documentation](#full-documentation)
- [Tech Stack](#tech-stack)
- [Testing the API](#testing-the-api)

---

## Overview

**TerraViva** is a complete platform that democratizes access to agricultural technology for small and medium-sized Brazilian farmers. The platform combines:

- **Context-aware AI agricultural consulting** tailored to region, climate, season, and budget
- **Cooperative marketplace** for selling produce
- **Chat system** for forming cooperatives
- **Smart diagnostic** that powers personalized recommendations

### How It Works

1. **Initial Diagnostic**: The farmer answers 3 screens of questions about location, budget, and business goals
2. **Context-Aware AI**: Based on the diagnostic, the AI provides technical advice adapted to the farmer's reality
3. **Marketplace**: Farmers can list surplus produce and find complementary products
4. **Cooperatives**: Matching and chat system for forming cooperatives

---

## Key Features

### 1. Authentication and Profile
- Secure JWT login with bcrypt hashing
- Profile automatically generated from the diagnostic
- User's name displayed throughout the app ("Hello, {name}")

### 2. 3-Step Diagnostic
- **Screen 1 - Location**: City/state → AI infers soil type and climate
- **Screen 2 - Budget**: Monthly amount → AI keeps recommendations within the actual budget
- **Screen 3 - Business Interests**: Sales channel and type of cooperation → AI adapts technical advice

### 3. Home
- **Technical Assistance (Chatbot)**: AI consulting using location, soil, climate, budget, and goals
- **Market Feed**: Farmers in the same state, sorted by proximity

### 4. Market (Marketplace)
- Product search filtered by state
- Profiles of farmers with available surplus
- Favorites and messaging system

### 5. Other Farmers' Profiles
- View production details
- Favorite farmers
- Send direct messages
- Request to create a cooperative

### 6. My Profile
- Edit personal information
- Manage surplus products
- Accept cooperative requests
- View favorited farmers

### 7. Cooperatives (Chat System)
- **Private 1-on-1 Chat**: Direct conversation with other farmers
- **Cooperative Chat (Group)**: Created automatically when a request is accepted
- **Administrator**: Whoever sent the first request becomes the group admin
- Add members and manage the group

---

## System Architecture

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│ FRONTEND                                               │
│ React 19 + React Router + Context API + Tailwind CSS   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Pages        │  │ Components   │  │ Context      │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  │
│  │ - Home       │  │ - Layout     │  │ - AuthContext│  │
│  │ - Profile    │  │ - Cards      │  │              │  │
│  │ - Market     │  │ - Modals     │  │              │  │
│  │ - Chat       │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             ▼
┌────────────────────────────────────────────────────────┐
│ BACKEND                                                │
│ FastAPI + SQLAlchemy + JWT                             │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Routers      │  │ Models       │  │ Auth         │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  │
│  │ - farmers    │  │ - Farmer     │  │ - JWT        │  │
│  │ - questions  │  │ - Question   │  │ - Bcrypt     │  │
│  │ - marketplace│  │ - Listing    │  │ - Bearer     │  │
│  │ - social     │  │ - Message    │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────────────────────────────────┘
                             │
                             │ SQL/ORM
                             ▼
┌────────────────────────────────────────────────────────┐
│ DATABASE                                               │
│ SQLite (dev) / PostgreSQL (prod)                       │
│                                                        │
│ Farmers | Questions | Listings | Cooperatives          │
│ Messages | Products | CooperativeRequests | ...        │
└────────────────────────────────────────────────────────┘
                             │
                             │ OpenAI API
                             ▼
┌────────────────────────────────────────────────────────┐
│ EXTERNAL SERVICES                                      │
│ - OpenAI GPT-4o (AI Consulting)                        │
│ - GPT-4o Vision (Image Analysis)                       │
│ - Regional Data (Climate, Soil, Pests)                 │
└────────────────────────────────────────────────────────┘
```

---

## Installation and Setup

### Prerequisites

- Python 3.12+
- Node.js 18+ and npm
- OpenAI account (for the AI advisor)

### 1. Clone the Repository

```bash
git clone https://github.com/seu-usuario/terraviva.git
cd terraviva
```

### 2. Set Up the Backend

```bash
# Go to the backend folder
cd terraviva/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add:
# - OPENAI_API_KEY=your_key_here
# - SECRET_KEY=your_jwt_secret_key
# - DATABASE_URL=sqlite:///./bd_terraviva.db (or PostgreSQL)
```

### 3. Set Up the Frontend

```bash
# Go to the frontend folder
cd ../frontend2/terraviva

# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env with:
# REACT_APP_API_URL=http://localhost:8000
```

### 4. Run the Project

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

Access:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8003/docs
- ReDoc: http://localhost:8003/redoc

### 5. Test Credentials

To test the application, use the following pre-registered test profile:

Email: teste.backend@terraviva.com
Password: senha123


This profile already has:
- Completed diagnostic
- Location set (Patos, PB)
- Budget and business goals defined
- Full access to all features

**Where to use it:**
1. Log in to the frontend (http://localhost:3000) with these credentials
2. Or use them in Swagger UI (http://localhost:8003/docs) to test the API directly

---

## Full Documentation

The full documentation is organized by module:

### Documentation by Module

| Module | Description | Link |
|--------|-------------|------|
| **Authentication** | Login flow, JWT, user profile | [docs/AUTENTICACAO.md](docs/AUTENTICACAO.md) |
| **Diagnostic** | The 3 diagnostic screens and how they feed the system | [docs/DIAGNOSTICO.md](docs/DIAGNOSTICO.md) |
| **Backend** | Routes, models, schemas, business logic | [docs/BACKEND.md](docs/BACKEND.md) |
| **Database** | Tables, relationships, ER diagram | [docs/DATABASE.md](docs/DATABASE.md) |
| **Frontend** | Structure, components, hooks, pages | [docs/FRONTEND.md](docs/FRONTEND.md) |
| **API** | Request and payload examples | [docs/API.md](docs/API.md) |

### Quick Links

- [How do authentication and the user profile work?](docs/AUTENTICACAO.md)
- [How does the diagnostic feed the chatbot?](docs/DIAGNOSTICO.md#como-o-diagnóstico-alimenta-a-ia)
- [How does the market feed filter by state?](docs/BACKEND.md#marketplace-feed)
- [How do you create a cooperative?](docs/DATABASE.md#fluxo-de-cooperativas)
- [Frontend folder structure](docs/FRONTEND.md#estrutura-de-pastas)
- [API call examples](docs/API.md)

---

## Tech Stack

### Backend
- **FastAPI** 0.119 - Modern, fast web framework
- **SQLAlchemy** 2.0 - Python ORM
- **Pydantic** 2.12 - Data validation
- **Python-Jose** - JWT authentication
- **Passlib + Bcrypt** - Secure password hashing
- **OpenAI** 2.7 - GPT-4 integration
- **Python-Dotenv** - Environment variable management
- **Uvicorn** - ASGI server

### Frontend
- **React** 19.2 - UI library
- **React Router** 7.9 - Routing
- **Tailwind CSS** 4.1 - Utility-first CSS framework
- **Lucide React** - Icons
- **Class Variance Authority** - Component variants
- **React Context API** - Global state management

### Database
- **SQLite** - Local development
- **PostgreSQL** - Production (Supabase recommended)

### AI and Data
- **OpenAI GPT-4o** - Intelligent agricultural consulting
- **GPT-4o Vision** - Crop image analysis
- **Regional Database** - Climate, soil, and pests by Brazilian state

---

## Key System Concepts

### Diagnostic → AI Flow

┌──────────────────┐
│ 1. DIAGNOSTIC │ User fills in:
│ │ - City/State (PB, Patos)
│ │ - Budget (R$ 100/month)
│ │ - Goals (direct sales, weekly cooperation)
└────────┬─────────┘
│
▼
┌──────────────────┐
│ 2. SAVED TO DB │ Backend saves to farmer.diagnostic_profile
│ │ And automatically infers:
│ │ - Regional soil type
│ │ - Current climate
└────────┬─────────┘
│
▼
┌──────────────────┐
│ 3. AI USES DATA │ When the user asks something:
│ │ AI receives the full context:
│ │ - Location → Soil + Climate
│ │ - Budget → Limits recommendations
│ │ - Goals → Adapts advice
└────────┬─────────┘
│
▼
┌──────────────────┐
│ 4. CONTEXT-AWARE │ “For corn in Patos/PB with a budget
│ RESPONSE │ of R$100/month focused on direct sales...”
└──────────────────┘


### Cooperative Creation Flow

Farmer A Farmer B System
│ │ │
│─── View B’s profile ─────────────│ │
│ │ │
│─── Request cooperative ──────────┼─────────────────────────►│
│ │ │
│ │◄── Notification ───────────│
│ │ │
│ │─── Accept request ────────►│
│ │ │
│◄──── Chat created ───────────────┼────────────────────────────│
│ │ │
│─── Chat conversation ───────────►│ │
│ │ │
│─── A becomes group admin ────────┼────────────────────────────│
│ │ │
│─── Add Farmer C ─────────────────┼────────────────────────────│


---

## Testing the API

You can test the API directly through Swagger UI:

1. Start the backend: `uvicorn main:app --reload`
2. Go to: http://localhost:8003/docs
3. Test the endpoints interactively

### Quick cURL example:

```bash
# Login
curl -X POST "http://localhost:8003/farmers/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "teste.backend@terraviva.com", "password": "senha123"}'

# Ask the AI a question
curl -X POST "http://localhost:8003/questions/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "question_text=How do I plant corn?"
```

See more examples in [docs/API.md](docs/API.md)

---

## Folder Structure

## Folder Structure

```
terraviva-4/
├── README.md                 # This file
├── docs/                     # Full documentation
│   ├── AUTENTICACAO.md
│   ├── DIAGNOSTICO.md
│   ├── BACKEND.md
│   ├── DATABASE.md
│   ├── FRONTEND.md
│   └── API.md
└── terraviva/
    ├── backend/              # FastAPI API
    │   ├── main.py           # Entry point
    │   ├── auth.py           # JWT authentication
    │   ├── ai_context.py     # AI context
    │   ├── regional_data.py  # Data by state
    │   ├── requirements.txt  # Python dependencies
    │   └── routers/          # API routes
    │       ├── farmers.py
    │       ├── questions.py
    │       ├── marketplace.py
    │       └── social.py
    ├── database/             # Database models
    │   ├── models.py         # SQLAlchemy models
    │   ├── schemas.py        # Pydantic schemas
    │   └── database.py       # Database configuration
    └── frontend2/terraviva/  # React app
        ├── src/
        │   ├── api/          # API calls
        │   ├── context/      # Context API
        │   ├── componentes/  # UI components
        │   ├── screens/      # Pages
        │   └── App.js
        └── package.json
```
---

## Environment Variables

### Backend (.env)

```bash
# OpenAI (required for AI)
OPENAI_API_KEY=sk-proj-...

# JWT
SECRET_KEY=your_very_secure_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///./bd_terraviva.db
# or PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/terraviva
```

### Frontend (.env)

```bash
REACT_APP_API_URL=http://localhost:8003
```

---

## Troubleshooting

### Backend won't start

```bash
# Check that the venv is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check that Python is 3.12+
python --version
```

### Frontend won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js
node --version  # Must be 18+
```

### AI isn't responding

- Check that `OPENAI_API_KEY` is set in `.env`
- Check that your OpenAI account has credits
- Check the backend logs for error messages

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Authors

**TerraViva Team**: Jullya Eloy, Luis Augusto Queiroz, and Maria Luisa Quintela. Democratizing agricultural technology in Brazil.

<div align="center">

  **TerraViva - Technology that Cultivates the Future**

  Innovating alongside those who feed Brazil

</div>
