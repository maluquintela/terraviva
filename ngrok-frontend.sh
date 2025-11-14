#!/bin/bash

# Script para expor apenas o FRONTEND via ngrok
# Porta: 3000 (React)

echo "=========================================="
echo "🌐 Expondo Frontend TerraViva"
echo "=========================================="
echo ""
echo "Porta local: 3000"
echo ""
echo "⏳ Iniciando túnel..."
echo ""

# Inicia o ngrok na porta 3000
ngrok http 3000

# Nota: O ngrok mostrará o URL público automaticamente
# Exemplo: https://abc123.ngrok.io -> http://localhost:3000


