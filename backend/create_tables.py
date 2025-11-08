"""
Script para criar todas as tabelas no banco de dados Supabase
Execute este script após configurar o DATABASE_URL no arquivo .env
"""

from database import Base, engine
import models

def create_tables():
    """Cria todas as tabelas definidas nos models"""
    print("🔄 Criando tabelas no banco de dados Supabase...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tabelas criadas com sucesso!")
        print("\nTabelas criadas:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        raise

if __name__ == "__main__":
    create_tables()

