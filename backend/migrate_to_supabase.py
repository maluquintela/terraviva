"""
Script para migrar dados do SQLite local para o Supabase (PostgreSQL)
Execute este script após configurar a DATABASE_URL no .env
"""

import os
import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

# Carregar variáveis de ambiente
load_dotenv()

# Importar modelos da pasta database/
from database import models

def migrate_data():
    """Migra dados do SQLite para PostgreSQL"""
    
    # URL do SQLite local (agora na pasta database/)
    db_dir = Path(__file__).parent.parent / "database"
    db_file = db_dir / "bd_terraviva.db"
    sqlite_url = f"sqlite:///{db_file}"
    
    # URL do Supabase (PostgreSQL)
    supabase_url = os.getenv("DATABASE_URL")
    
    if not supabase_url:
        print("❌ Erro: DATABASE_URL não encontrada no .env")
        print("   Configure a variável DATABASE_URL com a connection string do Supabase")
        sys.exit(1)
    
    if not supabase_url.startswith("postgresql") and not supabase_url.startswith("postgres"):
        print("❌ Erro: DATABASE_URL não parece ser uma URL PostgreSQL")
        print(f"   URL recebida: {supabase_url[:50]}...")
        sys.exit(1)
    
    print("🔄 Iniciando migração de dados...")
    print(f"   Origem: SQLite (local)")
    print(f"   Destino: Supabase (PostgreSQL)")
    print()
    
    try:
        # Conectar ao SQLite
        print("📦 Conectando ao SQLite local...")
        sqlite_engine = create_engine(sqlite_url, echo=False)
        sqlite_session = sessionmaker(bind=sqlite_engine)()
        
        # Conectar ao Supabase
        print("☁️  Conectando ao Supabase...")
        # Limpar parâmetros de query se existirem
        supabase_url_clean = supabase_url.split("?")[0]
        supabase_engine = create_engine(
            supabase_url_clean,
            pool_pre_ping=True
        )
        supabase_session = sessionmaker(bind=supabase_engine)()
        
        # Verificar conexões
        sqlite_engine.connect()
        supabase_engine.connect()
        print("✅ Conexões estabelecidas com sucesso!")
        print()
        
        # Ordem de migração (respeitando dependências de foreign keys)
        migration_order = [
            models.Farmer,
            models.Product,
            models.Cooperative,
            models.Question,
            models.Listing,
            models.CooperativeMembership,
        ]
        
        total_migrated = 0
        
        for model_class in migration_order:
            table_name = model_class.__tablename__
            
            # Verificar se a tabela existe no SQLite
            inspector = inspect(sqlite_engine)
            if table_name not in inspector.get_table_names():
                print(f"⚠️  Tabela '{table_name}' não existe no SQLite, pulando...")
                continue
            
            # Ler dados do SQLite
            print(f"📖 Lendo dados de '{table_name}'...")
            sqlite_data = sqlite_session.query(model_class).all()
            
            if not sqlite_data:
                print(f"   ℹ️  Nenhum dado encontrado em '{table_name}'")
                continue
            
            # Migrar dados
            print(f"💾 Migrando {len(sqlite_data)} registros de '{table_name}'...")
            migrated_count = 0
            
            for record in sqlite_data:
                try:
                    # Criar novo registro no Supabase
                    supabase_session.merge(record)
                    migrated_count += 1
                except Exception as e:
                    print(f"   ⚠️  Erro ao migrar registro {record.id}: {str(e)}")
                    continue
            
            # Commit para esta tabela
            try:
                supabase_session.commit()
                print(f"   ✅ {migrated_count} registros migrados com sucesso!")
                total_migrated += migrated_count
            except Exception as e:
                print(f"   ❌ Erro ao fazer commit: {str(e)}")
                supabase_session.rollback()
            
            print()
        
        # Fechar sessões
        sqlite_session.close()
        supabase_session.close()
        
        print("=" * 50)
        print(f"✅ Migração concluída!")
        print(f"   Total de registros migrados: {total_migrated}")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Erro durante a migração: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 Migrador SQLite → Supabase")
    print("=" * 50)
    print()
    
    # Confirmar antes de migrar
    resposta = input("⚠️  Esta operação irá migrar dados do SQLite para o Supabase.\n   Tem certeza que deseja continuar? (s/N): ")
    
    if resposta.lower() not in ['s', 'sim', 'y', 'yes']:
        print("❌ Migração cancelada pelo usuário.")
        sys.exit(0)
    
    print()
    migrate_data()

