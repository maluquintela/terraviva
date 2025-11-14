#!/bin/bash

# Script para expor apenas o BACKEND via ngrok
# Porta: 8000 (FastAPI)

echo "=========================================="
echo "⚙️  Expondo Backend TerraViva"
echo "=========================================="
echo ""
echo "Porta local: 8000"
echo ""
echo "⏳ Iniciando túnel..."
echo ""

# Inicia o ngrok na porta 8000
ngrok http 8000

# Nota: O ngrok mostrará o URL público automaticamente
# Exemplo: https://xyz789.ngrok.io -> http://localhost:8000


