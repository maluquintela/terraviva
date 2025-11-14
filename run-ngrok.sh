#!/bin/bash

# Script para rodar ngrok no TerraViva
# Expõe tanto o frontend (3000) quanto o backend (8000)

echo "=========================================="
echo "🚀 Iniciando túneis ngrok para TerraViva"
echo "=========================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo ""
echo "⏳ Iniciando túneis..."
echo ""

# Inicia o ngrok com ambas as portas
# O túnel será acessível através de URLs públicas
ngrok http 3000 --log=stdout &
FRONTEND_PID=$!

sleep 2

ngrok http 8000 --log=stdout &
BACKEND_PID=$!

echo ""
echo "✅ Túneis iniciados!"
echo ""
echo "📋 Para ver os URLs públicos, acesse:"
echo "   http://localhost:4040"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Mantenha este terminal aberto"
echo "   - Para parar: Ctrl+C"
echo ""
echo "🔗 Os links públicos aparecerão acima ou em http://localhost:4040"
echo ""

# Aguarda os processos
wait $FRONTEND_PID $BACKEND_PID


