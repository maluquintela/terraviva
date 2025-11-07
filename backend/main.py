import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine, models
from routers import farmers, questions, marketplace

# Criar todas as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

# Criar aplicação FastAPI
app = FastAPI(
    title="TerraViva API",
    description="Plataforma que conecta agricultores familiares a uma IA agrícola consultora e a um marketplace cooperativo",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(farmers.router)
app.include_router(questions.router)
app.include_router(marketplace.router)

@app.get("/")
def home():
    """Endpoint inicial da API"""
    return {
        "message": "TerraViva API - Conectando agricultores familiares à tecnologia",
        "version": "1.0.0",
        "docs": "/docs",
        "modules": [
            "Agricultores (Farmers)",
            "Consultoria IA (Questions)", 
            "Marketplace Cooperativo"
        ]
    }

@app.get("/health")
def health_check():
    """Verificação de saúde da API"""
    return {"status": "healthy", "message": "TerraViva API está funcionando!"}
