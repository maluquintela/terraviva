import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import SessionLocal, models
import os
from dotenv import load_dotenv

load_dotenv()

# Configurações de segurança
SECRET_KEY = os.getenv("SECRET_KEY", "minhasenha")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Contexto para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração do Bearer token
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha está correta"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gera hash da senha"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[int]:
    """Verifica e decodifica o token JWT"""
    # Suporte para tokens locais de desenvolvimento (fake tokens)
    if token.startswith("local-"):
        # Extrair ID do token local: "local-123" -> 123
        try:
            farmer_id = int(token.split("-")[1])
            return farmer_id
        except (IndexError, ValueError):
            return None
    
    # Verificação normal de JWT para tokens reais
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        farmer_id: int = payload.get("sub")
        if farmer_id is None:
            return None
        return farmer_id
    except JWTError:
        return None

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_farmer(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Dependency para obter o agricultor atual autenticado"""
    token = credentials.credentials
    
    # Suporte para desenvolvimento local com fake token
    if token.startswith("local-"):
        # Buscar ou criar farmer de desenvolvimento
        farmer = db.query(models.Farmer).filter(models.Farmer.email == "dev@local.test").first()
        if farmer is None:
            # Criar farmer de desenvolvimento se não existir
            farmer = models.Farmer(
                name="Desenvolvedor Local",
                email="dev@local.test",
                password_hash=get_password_hash("dev123"),  # Senha hash obrigatória
                region="Nordeste",  # Região obrigatória
                city="Patos",
                state="PB",
                budget=100,
                bio="Usuário de desenvolvimento local",
                cooperation_type="semanal",
                sale_target="direta"
            )
            db.add(farmer)
            db.commit()
            db.refresh(farmer)
        return farmer
    
    # Autenticação normal com JWT
    farmer_id = verify_token(token)
    
    if farmer_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Agricultor não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return farmer
