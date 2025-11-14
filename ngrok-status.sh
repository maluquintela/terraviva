#!/bin/bash

# Script para verificar status dos túneis ngrok

echo "=========================================="
echo "📊 Status dos Túneis Ngrok"
echo "=========================================="
echo ""

# Verificar se ngrok está rodando
if pgrep -x "ngrok" > /dev/null; then
    echo "✅ Ngrok está RODANDO"
    echo ""
    
    # Tentar obter URLs públicas
    if wget -qO- http://localhost:4040/api/tunnels 2>/dev/null > /tmp/ngrok-status.json; then
        echo "🔗 URLs Públicas Ativas:"
        echo ""
        python3 << 'EOF'
import json
try:
    with open('/tmp/ngrok-status.json', 'r') as f:
        data = json.load(f)
        tunnels = data.get('tunnels', [])
        if tunnels:
            for i, tunnel in enumerate(tunnels, 1):
                print(f"   Túnel {i}:")
                print(f"   └─ URL: {tunnel['public_url']}")
                print(f"   └─ Local: {tunnel['config']['addr']}")
                print()
        else:
            print("   ⚠️  Nenhum túnel ativo")
except Exception as e:
    print(f"   ❌ Erro ao ler túneis: {e}")
EOF
        echo "📋 Interface Web: http://localhost:4040"
        echo ""
    else
        echo "⚠️  Interface do ngrok não está respondendo"
        echo "   Verifique se o ngrok está realmente rodando"
        echo ""
    fi
    
    # Mostrar processos ngrok
    echo "🔍 Processos ativos:"
    ps aux | grep ngrok | grep -v grep | awk '{print "   PID: "$2" | Comando: "$11" "$12" "$13}'
    
else
    echo "❌ Ngrok NÃO está rodando"
    echo ""
    echo "Para iniciar:"
    echo "   Frontend: ./ngrok-frontend.sh"
    echo "   Backend:  ./ngrok-backend.sh"
    echo "   Manual:   ngrok http 3000"
fi

echo ""
echo "=========================================="


