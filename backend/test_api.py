#!/usr/bin/env python3
"""Script para testar o endpoint de perguntas"""
import requests
import json

# Simular dados do frontend
data = {
    "farmer_id": 1,
    "question_text": "Teste de pergunta",
    "sent_at": "2025-11-14T02:30:00.000Z"
}

print("🧪 Testando endpoint /questions/")
print(f"📤 Enviando: {json.dumps(data, indent=2)}")
print("-" * 50)

try:
    # Teste 1: Enviar como FormData com token local (como o frontend)
    print("\n1️⃣ Teste com FormData e token local:")
    response = requests.post(
        "http://localhost:8000/questions/",
        data=data,  # FormData
        headers={"Authorization": "Bearer local-1234567890"}
    )
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   ✅ Sucesso! Resposta: {response.json().get('answer_text', '')[:100]}...")
    else:
        print(f"   ❌ Erro: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

try:
    # Teste 2: Verificar se precisa de autenticação
    print("\n2️⃣ Teste sem token:")
    response = requests.post(
        "http://localhost:8000/questions/",
        data=data
    )
    print(f"   Status: {response.status_code}")
    print(f"   Resposta: {response.text[:200]}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Verificar se o endpoint existe
try:
    print("\n3️⃣ Verificando endpoints disponíveis:")
    response = requests.get("http://localhost:8000/docs")
    if response.status_code == 200:
        print("   ✅ API está rodando (docs acessível)")
    else:
        print(f"   ⚠️ API retornou status {response.status_code}")
except Exception as e:
    print(f"   ❌ Erro ao acessar docs: {e}")

