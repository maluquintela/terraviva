#!/bin/bash

# Menu interativo para gerenciar ngrok no TerraViva

clear

echo "=========================================="
echo "🌐 TerraViva - Gerenciador Ngrok"
echo "=========================================="
echo ""

# Verificar status atual
if pgrep -x "ngrok" > /dev/null; then
    echo "📊 Status: ✅ RODANDO"
    
    # Obter URL se disponível
    if wget -qO- http://localhost:4040/api/tunnels 2>/dev/null > /tmp/ngrok-menu.json; then
        URL=$(python3 -c "import json; data=json.load(open('/tmp/ngrok-menu.json')); print(data['tunnels'][0]['public_url'] if data.get('tunnels') else '')" 2>/dev/null)
        if [ ! -z "$URL" ]; then
            echo "🔗 URL Pública: $URL"
        fi
    fi
else
    echo "📊 Status: ⏸️  PARADO"
fi

echo ""
echo "=========================================="
echo ""
echo "Escolha uma opção:"
echo ""
echo "  1) 🌐 Iniciar Frontend (porta 3000)"
echo "  2) ⚙️  Iniciar Backend (porta 8000)"
echo "  3) 📊 Ver Status Detalhado"
echo "  4) 🛑 Parar Ngrok"
echo "  5) 📋 Copiar URL Público"
echo "  6) 🌍 Abrir Interface Web (localhost:4040)"
echo "  7) 📚 Ver Documentação"
echo "  0) ❌ Sair"
echo ""
echo "=========================================="
echo ""
read -p "Digite o número da opção: " opcao

case $opcao in
    1)
        echo ""
        echo "🚀 Iniciando túnel do Frontend..."
        echo ""
        ./ngrok-frontend.sh
        ;;
    2)
        echo ""
        echo "🚀 Iniciando túnel do Backend..."
        echo ""
        ./ngrok-backend.sh
        ;;
    3)
        echo ""
        ./ngrok-status.sh
        echo ""
        read -p "Pressione Enter para voltar..."
        ./ngrok-menu.sh
        ;;
    4)
        echo ""
        echo "🛑 Parando ngrok..."
        pkill ngrok
        sleep 1
        echo "✅ Ngrok parado!"
        echo ""
        read -p "Pressione Enter para voltar..."
        ./ngrok-menu.sh
        ;;
    5)
        echo ""
        if wget -qO- http://localhost:4040/api/tunnels 2>/dev/null > /tmp/ngrok-menu.json; then
            URL=$(python3 -c "import json; data=json.load(open('/tmp/ngrok-menu.json')); print(data['tunnels'][0]['public_url'] if data.get('tunnels') else '')" 2>/dev/null)
            if [ ! -z "$URL" ]; then
                echo "📋 URL Público:"
                echo ""
                echo "   $URL"
                echo ""
                # Tentar copiar para clipboard (se xclip estiver instalado)
                if command -v xclip &> /dev/null; then
                    echo "$URL" | xclip -selection clipboard
                    echo "✅ URL copiado para área de transferência!"
                else
                    echo "💡 Dica: Instale 'xclip' para copiar automaticamente"
                    echo "   sudo apt install xclip"
                fi
            else
                echo "❌ Nenhum túnel ativo"
            fi
        else
            echo "❌ Ngrok não está rodando"
        fi
        echo ""
        read -p "Pressione Enter para voltar..."
        ./ngrok-menu.sh
        ;;
    6)
        echo ""
        echo "🌍 Abrindo interface web..."
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:4040 2>/dev/null
            echo "✅ Interface aberta no navegador!"
        else
            echo "📋 Acesse manualmente: http://localhost:4040"
        fi
        echo ""
        read -p "Pressione Enter para voltar..."
        ./ngrok-menu.sh
        ;;
    7)
        echo ""
        echo "📚 Documentação disponível:"
        echo ""
        echo "   • NGROK-RESUMO.md  - Guia rápido"
        echo "   • NGROK-GUIA.md    - Documentação completa"
        echo ""
        echo "Para ler:"
        echo "   cat NGROK-RESUMO.md"
        echo ""
        read -p "Pressione Enter para voltar..."
        ./ngrok-menu.sh
        ;;
    0)
        echo ""
        echo "👋 Até logo!"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Opção inválida!"
        sleep 2
        ./ngrok-menu.sh
        ;;
esac


