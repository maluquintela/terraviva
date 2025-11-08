from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Usar a URL do Supabase PostgreSQL ou SQLite como fallback
DATABASE_URL = os.getenv("DATABASE_URL")

# Se DATABASE_URL não estiver configurada ou para desenvolvimento local, use SQLite
if not DATABASE_URL or DATABASE_URL == "sqlite":
    DATABASE_URL = "sqlite:///./bd_terraviva.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Para PostgreSQL não precisamos do check_same_thread (que é específico do SQLite)
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verifica a conexão antes de usar
        pool_size=10,        # Número de conexões no pool
        max_overflow=20      # Conexões extras quando necessário
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
