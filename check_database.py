#!/usr/bin/env python3
"""Script para verificar dados no banco de dados SQLite"""

import sqlite3
from datetime import datetime

# Conectar ao banco de dados
db_path = "database/bd_terraviva.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 80)
print("VERIFICAÇÃO DO BANCO DE DADOS - TerraViva")
print("=" * 80)
print()

# Verificar farmers
print("📊 AGRICULTORES CADASTRADOS:")
print("-" * 80)
cursor.execute("""
    SELECT id, name, email, city, state, created_at, bio
    FROM farmers
    ORDER BY id
""")
farmers = cursor.fetchall()

if farmers:
    for farmer in farmers:
        farmer_id, name, email, city, state, created_at, bio = farmer
        print(f"\n🌱 ID: {farmer_id}")
        print(f"   Nome: {name}")
        print(f"   Email: {email}")
        print(f"   Localização: {city}, {state}")
        print(f"   Cadastrado em: {created_at}")
        if bio:
            print(f"   Bio: {bio[:80]}{'...' if len(bio) > 80 else ''}")
else:
    print("   ❌ Nenhum agricultor cadastrado!")

print()
print("=" * 80)
print(f"TOTAL: {len(farmers)} agricultores no banco de dados")
print("=" * 80)
print()

# Verificar cooperação e tipos de venda
print("📊 PERFIS COM OBJETIVOS COMERCIAIS:")
print("-" * 80)
cursor.execute("""
    SELECT id, name, cooperation_type, sale_target
    FROM farmers
    WHERE cooperation_type IS NOT NULL OR sale_target IS NOT NULL
    ORDER BY id
""")
farmers_with_goals = cursor.fetchall()

if farmers_with_goals:
    for farmer in farmers_with_goals:
        farmer_id, name, coop, sale = farmer
        print(f"\n🌱 {name} (ID: {farmer_id})")
        print(f"   Tipo de cooperação: {coop or 'Não definido'}")
        print(f"   Alvo de venda: {sale or 'Não definido'}")
else:
    print("   ℹ️  Nenhum agricultor tem objetivos comerciais definidos")

print()
print("=" * 80)

# Verificar produtos
print("\n📦 PRODUTOS CADASTRADOS:")
print("-" * 80)
cursor.execute("SELECT COUNT(*) FROM products")
products_count = cursor.fetchone()[0]
print(f"   Total de produtos: {products_count}")

# Verificar anúncios
print("\n📢 ANÚNCIOS ATIVOS:")
print("-" * 80)
cursor.execute("SELECT COUNT(*) FROM listings")
listings_count = cursor.fetchone()[0]
print(f"   Total de anúncios: {listings_count}")

# Verificar perguntas
print("\n💬 PERGUNTAS FEITAS:")
print("-" * 80)
cursor.execute("SELECT COUNT(*) FROM questions")
questions_count = cursor.fetchone()[0]
print(f"   Total de perguntas: {questions_count}")

print()
print("=" * 80)
print()

# Diagnóstico
print("🔍 DIAGNÓSTICO:")
print("-" * 80)
if len(farmers) == 0:
    print("   ❌ PROBLEMA: Nenhum agricultor cadastrado!")
    print("   💡 SOLUÇÃO: Cadastre agricultores através da tela de login/registro")
elif len(farmers) == 1:
    print("   ⚠️  ATENÇÃO: Apenas 1 agricultor cadastrado!")
    print("   💡 Para ver o feed social, é necessário ter 2+ agricultores")
elif len(farmers) == 2:
    print(f"   ✅ OK: {len(farmers)} agricultores cadastrados")
    print("   💡 O feed social já pode funcionar!")
else:
    print(f"   ✅ ÓTIMO: {len(farmers)} agricultores cadastrados")
    print("   💡 O feed social está funcionando perfeitamente!")

print()
print("=" * 80)

conn.close()


