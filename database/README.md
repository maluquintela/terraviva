# Pasta Database

Esta pasta contém todos os arquivos relacionados ao banco de dados do projeto TerraViva.

## Estrutura

- `database.py` - Configuração do banco de dados (SQLAlchemy engine, session, Base)
- `models.py` - Modelos SQLAlchemy (tabelas do banco de dados)
- `schemas.py` - Schemas Pydantic (validação de dados da API)
- `__init__.py` - Inicialização do módulo Python
- `bd_terraviva.db` - Arquivo SQLite (será criado automaticamente se usar SQLite local)

## Uso

Os arquivos do backend importam os módulos da seguinte forma:

```python
from database import SessionLocal, models, schemas
```

## Configuração

O banco de dados pode ser configurado via variável de ambiente `DATABASE_URL`:

- **SQLite (desenvolvimento)**: Se não definida, usa SQLite local
- **PostgreSQL (Supabase)**: Defina `DATABASE_URL` com a connection string do Supabase

## Migração

Para migrar dados do SQLite para o Supabase, use o script:
```bash
python backend/migrate_to_supabase.py
```

