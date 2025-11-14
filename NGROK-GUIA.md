# 🌐 Guia Completo - Ngrok no TerraViva

## ✅ Status da Configuração

- **Ngrok instalado:** `/snap/bin/ngrok`
- **Authtoken configurado:** ✅ Salvo em `~/.config/ngrok/ngrok.yml`
- **Portas detectadas:**
  - Frontend (React): **3000**
  - Backend (FastAPI): **8000**

---

## 🚀 Como Usar

### Opção 1: Expor apenas o Frontend (Recomendado para testes)

```bash
cd ~/terraviva
./ngrok-frontend.sh
```

Ou diretamente:
```bash
ngrok http 3000
```

### Opção 2: Expor apenas o Backend

```bash
cd ~/terraviva
./ngrok-backend.sh
```

Ou diretamente:
```bash
ngrok http 8000
```

### Opção 3: Expor ambos simultaneamente

**Método 1 - Dois terminais separados:**

Terminal 1:
```bash
ngrok http 3000
```

Terminal 2:
```bash
ngrok http 8000
```

**Método 2 - Script unificado (em desenvolvimento):**
```bash
cd ~/terraviva
./run-ngrok.sh
```

---

## 📋 Interpretando o Resultado

Quando você rodar o ngrok, verá algo assim:

```
Session Status                online
Account                       Seu Nome (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc-123-xyz.ngrok-free.dev -> http://localhost:3000
```

### 🔍 O que importa:

- **Forwarding:** Este é o seu link público! 
  - Exemplo: `https://abc-123-xyz.ngrok-free.dev`
- **Web Interface:** Acesse `http://localhost:4040` para ver:
  - Todas as requisições em tempo real
  - Status do túnel
  - URLs públicas ativas

---

## 🔗 Como Copiar o Link Público

### Método 1: Copiar da tela do ngrok
O link aparece na linha **"Forwarding"** em azul/roxo.

### Método 2: Acessar a interface web
1. Abra no navegador: http://localhost:4040
2. O link público estará no topo da página
3. Clique para copiar

### Método 3: Via API (terminal)
```bash
wget -qO- http://localhost:4040/api/tunnels | python3 -c "import sys, json; [print(t['public_url']) for t in json.load(sys.stdin)['tunnels']]"
```

---

## ⚙️ Configurações Avançadas

### Expor com domínio personalizado (requer plano pago)
```bash
ngrok http 3000 --domain=seudominio.ngrok.io
```

### Adicionar autenticação básica
```bash
ngrok http 3000 --basic-auth="usuario:senha"
```

### Inspecionar tráfego HTTPS
```bash
ngrok http 3000 --inspect=true
```

### Executar em segundo plano
```bash
ngrok http 3000 > /dev/null &
```

---

## 🔄 Como Reiniciar o Túnel

1. **Parar o ngrok atual:**
   - Pressione `Ctrl + C` no terminal do ngrok

2. **Iniciar novamente:**
   - Execute o mesmo comando anterior
   - Exemplo: `./ngrok-frontend.sh`

3. **Nota importante:**
   - ⚠️ Cada vez que você reiniciar, **o URL público mudará**
   - Se precisar de URL fixo, considere o plano pago do ngrok

---

## 💡 Deixar Rodando Continuamente

### Para desenvolvimento (temporário):
Simplesmente mantenha o terminal aberto com o ngrok rodando.

### Para produção/testes longos:

1. **Usar tmux (recomendado):**
```bash
# Instalar tmux (se necessário)
sudo apt install tmux

# Criar sessão
tmux new -s ngrok

# Dentro do tmux, rodar ngrok
ngrok http 3000

# Sair do tmux (deixa rodando): Ctrl+B depois D
# Voltar para o tmux: tmux attach -t ngrok
```

2. **Usar screen:**
```bash
# Instalar screen (se necessário)
sudo apt install screen

# Criar sessão
screen -S ngrok

# Rodar ngrok
ngrok http 3000

# Sair: Ctrl+A depois D
# Voltar: screen -r ngrok
```

3. **Usar nohup (menos controle):**
```bash
nohup ngrok http 3000 > ngrok.log 2>&1 &
```

---

## 🛠️ Comandos Úteis

### Ver todos os túneis ativos
```bash
wget -qO- http://localhost:4040/api/tunnels | python3 -m json.tool
```

### Matar todos os processos ngrok
```bash
pkill ngrok
```

### Ver se ngrok está rodando
```bash
ps aux | grep ngrok
```

### Ver configuração do ngrok
```bash
cat ~/.config/ngrok/ngrok.yml
```

---

## 📱 Testando no Celular

1. Pegue o URL público (exemplo: `https://abc-123.ngrok-free.dev`)
2. Abra no navegador do celular
3. Na primeira vez, o ngrok mostrará uma tela de aviso
4. Clique em "Visit Site" para continuar

---

## ⚠️ Limitações do Plano Gratuito

- **40 requisições/minuto**
- **1 processo ngrok por vez** (para múltiplas portas, use conta paga)
- **URL aleatória** (muda a cada reinício)
- **Tela de aviso** antes de acessar o site

### Planos pagos oferecem:
- URLs fixas personalizadas
- Múltiplos túneis simultâneos
- Sem limite de requisições
- Sem tela de aviso

---

## 🔧 Troubleshooting

### "ngrok: command not found"
```bash
# Verificar se está instalado
which ngrok

# Se não estiver, instalar:
sudo snap install ngrok
```

### "Authentication error"
```bash
# Reconfigurar token
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### "Port already in use"
```bash
# Verificar o que está usando a porta
sudo netstat -tlnp | grep :3000

# Ou
sudo ss -tlnp | grep :3000
```

### "Web Interface not available"
Isso é normal se você fechou o ngrok. A interface só fica disponível enquanto o ngrok está rodando.

---

## 📞 Links Úteis

- **Dashboard ngrok:** https://dashboard.ngrok.com/
- **Documentação:** https://ngrok.com/docs
- **Status do serviço:** https://status.ngrok.com/

---

## 🎯 Exemplo de Uso Completo

```bash
# 1. Ir para a pasta do projeto
cd ~/terraviva

# 2. Garantir que frontend está rodando
# (em outro terminal)
cd frontend2/terraviva
npm start

# 3. Expor via ngrok
./ngrok-frontend.sh

# 4. Copiar o URL público que aparece
# Exemplo: https://xyz-123.ngrok-free.dev

# 5. Testar no navegador ou celular

# 6. Ver requisições em tempo real:
# Abrir http://localhost:4040
```

---

**✅ Configuração concluída! Seu ambiente está pronto para usar o ngrok.**


