import sqlite3

bancoterraviva = sqlite3.connect("bd_terraviva.db")
bancoterraviva.execute("PRAGMA foreign_keys = ON")
cur = bancoterraviva.cursor()

def criar_tabelas():
    cur.execute("""
        CREATE TABLE IF NOT EXISTS periodos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mes_plantacao INTEGER,
            mes_colheita INTEGER                          
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS usuarios_agricultores(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_usuario TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS plantacoes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_cultura TEXT NOT NULL,
            tipo_solo TEXT NOT NULL,
            clima TEXT NOT NULL,
            data_plantio TEXT,
            observacoes TEXT,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios_agricultores(id)
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS produtos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_produto TEXT,
            descricao TEXT,
            quantidade INTEGER,
            orcamento REAL,
            plantacao_id INTEGER,
            periodo_id INTEGER,
            FOREIGN KEY (plantacao_id) REFERENCES plantacoes(id),
            FOREIGN KEY (periodo_id) REFERENCES periodos(id)
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS ofertas_marketplace(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            quantidade INTEGER,
            preco REAL,
            local TEXT,
            periodo_id INTEGER,
            FOREIGN KEY (periodo_id) REFERENCES periodos(id)
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS vendas(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_agricultor_id INTEGER,
            marketplace_oferta_id INTEGER,
            FOREIGN KEY (usuario_agricultor_id) REFERENCES usuarios_agricultores(id),
            FOREIGN KEY (marketplace_oferta_id) REFERENCES ofertas_marketplace(id)
        )
    """)

    bancoterraviva.commit()

if __name__ == "__main__":
    criar_tabelas()
    bancoterraviva.close()
