from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Obter URL do banco de dados das variáveis de ambiente
# Se não estiver definida, usa SQLite local para desenvolvimento
# O arquivo SQLite será criado na pasta database/
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Caminho para o arquivo SQLite na pasta database/
    db_dir = Path(__file__).parent
    db_file = db_dir / "bd_terraviva.db"
    DATABASE_URL = f"sqlite:///{db_file}"

# Configurar engine baseado no tipo de banco
if DATABASE_URL.startswith("postgresql") or DATABASE_URL.startswith("postgres"):
    # PostgreSQL (Supabase)
    # Remover parâmetros de query se existirem (algumas URLs do Supabase vêm com ?sslmode=require)
    db_url_clean = DATABASE_URL.split("?")[0]
    engine = create_engine(
        db_url_clean,
        pool_pre_ping=True,  # Verifica conexões antes de usar
        pool_size=5,
        max_overflow=10
    )
else:
    # SQLite (desenvolvimento local)
    # Garantir que o diretório existe
    if DATABASE_URL.startswith("sqlite:///"):
        db_path = DATABASE_URL.replace("sqlite:///", "")
        db_dir = os.path.dirname(db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)
    
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

