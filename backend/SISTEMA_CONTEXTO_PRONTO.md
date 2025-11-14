# ✅ Sistema de Contextualização do Chatbot - IMPLEMENTADO

## Status: TOTALMENTE FUNCIONAL

O sistema de contextualização do chatbot com base nos dados do diagnóstico já está **completamente implementado e funcionando**!

---

## 📋 O Que Está Funcionando

### 1. Frontend ✅

**Arquivo**: `frontend2/terraviva/src/api/questions.js`

Envia para o backend:
- ✅ `farmer_id` - ID do agricultor
- ✅ `question_text` - Pergunta
- ✅ `sent_at` - Data/hora em ISO 8601 (ex: "2025-11-14T23:30:00.000Z")
- ✅ `image` - Foto opcional

```javascript
// Exemplo de envio
submitQuestion({
  farmerId: 123,
  questionText: "Como melhorar minha plantação de tomate?",
  sentAt: "2025-11-14T23:30:00.000Z",
  imageFile: arquivo_opcional
})
```

---

### 2. Backend - Contextualização ✅

**Arquivos Implementados**:

#### `backend/ai_context.py` ✅
Funções principais:
- `get_season_from_date(date_str)` - Extrai estação do ano da data
- `get_month_name(date_str)` - Retorna nome do mês em português
- `build_context_prompt(farmer, sent_at)` - Constrói contexto completo
- `build_system_prompt()` - Define comportamento da IA
- `get_chatgpt_prompts(question, farmer, sent_at, image_analysis)` - Gera prompts formatados

#### `backend/regional_data.py` ✅
Base de dados completa com TODOS os 27 estados brasileiros:
- Clima regional
- Temperatura média por estação
- Precipitação anual  
- Solo predominante
- Culturas principais
- Pragas comuns
- Época de plantio por estação

**Estados incluídos**: AC, AL, AM, AP, BA, CE, DF, ES, GO, MA, MG, MS, MT, PA, PB, PE, PI, PR, RJ, RN, RO, RR, RS, SC, SE, SP, TO

#### `backend/routers/questions.py` ✅
Endpoint `/questions/` já integrado:
- Recebe farmer_id, question_text, sent_at, image
- Busca dados do agricultor no banco
- Chama `get_chatgpt_prompts()` para gerar contexto
- Envia ao ChatGPT com contexto completo
- Retorna resposta contextualizada

---

## 🎯 Como o Sistema Funciona

### Fluxo Completo:

```
1. Usuário faz pergunta no chatbot
   ↓
2. Frontend envia: pergunta + farmer_id + data/hora
   ↓
3. Backend busca dados do agricultor:
   - Cidade, Estado
   - Bio gerada no diagnóstico
   - Tipo de cooperação
   - Canal de venda preferido
   ↓
4. Backend extrai contexto:
   - Estação do ano (da data enviada)
   - Clima da região (do estado)
   - Solo típico da região
   - Culturas recomendadas para época
   - Pragas comuns da região/época
   ↓
5. Backend constrói prompt contextualizado
   ↓
6. ChatGPT recebe contexto completo
   ↓
7. ChatGPT responde considerando:
   - Localização específica
   - Época do ano
   - Condições climáticas
   - Perfil do agricultor
   ↓
8. Resposta contextualizada volta ao usuário
```

---

## 📝 Exemplo de Contexto Gerado

### Entrada:
```
Pergunta: "Como melhorar minha plantação de tomate?"
Agricultor: João, Campinas, SP
Data: 14/11/2025 (Primavera)
```

### Contexto Enviado ao ChatGPT:

```
CONTEXTO DO AGRICULTOR E REGIÃO:

📍 Localização: Campinas, SP (São Paulo)

🌡️ Clima Regional: Subtropical úmido e tropical de altitude
   - Temperatura média atual (primavera): 22-28°C
   - Precipitação anual: 1200-1800mm

🌱 Solo da Região: Latossolo vermelho e terra roxa

📅 Época Atual: Primavera (Novembro)
   - Culturas recomendadas: soja, milho, amendoim

🌾 Culturas Principais da Região: cana-de-açúcar, laranja, café, soja, milho, tomate

⚠️ Pragas Comuns: broca-da-cana, mosca-branca, lagarta, pulgão

👤 Perfil do Agricultor:
   - Perfil: Prefiro trabalhar com cooperações semanais e busco vendas direta ao consumidor
   - Preferência de cooperação: cooperações semanais
   - Canal de venda: vendas diretas ao consumidor

💡 IMPORTANTE:
- Considere as condições climáticas típicas do primavera em SP
- Leve em conta o tipo de solo predominante na região
- Esteja atento às pragas comuns desta época e região
- Adapte as recomendações ao perfil de venda do agricultor

❓ PERGUNTA DO AGRICULTOR:
"Como melhorar minha plantação de tomate?"
```

### Resposta do ChatGPT (contextualizada):

> "Ótima época para tomate em Campinas! Na primavera paulista, com temperaturas entre 22-28°C e o latossolo vermelho da sua região, recomendo:
>
> 1. **Irrigação adequada**: Com as chuvas de primavera (1200-1800mm/ano), regue pela manhã cedo para aproveitar a umidade natural. Evite molhar as folhas para prevenir doenças.
>
> 2. **Atenção às pragas**: Nesta época, fique atento à mosca-branca e pulgão, muito comuns em SP. Use controle biológico com joaninhas ou calda de fumo.
>
> 3. **Adubação orgânica**: O solo latossolo da sua região retém bem nutrientes. Use composto orgânico a cada 15 dias para tomates vigorosos.
>
> 4. **Para vendas diretas semanais**: Plante em etapas (escalonado) para ter colheita contínua e atender seus clientes regularmente.
>
> ⚠️ Cuidado: Em novembro, o calor aumenta - monitore pragas diariamente!"

---

## 🔑 Variáveis de Ambiente Necessárias

Certifique-se de ter no arquivo `.env`:

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-proj-...sua_chave_aqui...

# Modelo (opcional, padrão: gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

---

## 🚀 Como Testar

### 1. Certifique-se que o backend está rodando:
```bash
cd /home/maluquintela/terraviva/backend
uvicorn main:app --reload --port 8003
```

### 2. Faça login no frontend e complete o diagnóstico:
- Informe cidade e estado
- Complete todas as etapas
- A bio será gerada automaticamente

### 3. Acesse o chatbot e faça uma pergunta:
- A pergunta será enviada com o `sent_at` (data/hora atual)
- O backend buscará seus dados do diagnóstico
- O ChatGPT receberá contexto completo da sua região e época
- A resposta virá personalizada!

---

## 📊 Dados Incluídos por Estado

Para cada estado brasileiro, o sistema conhece:
- ✅ Nome completo
- ✅ Tipo de clima
- ✅ Temperatura média (verão/inverno)
- ✅ Precipitação anual
- ✅ Tipo de solo predominante
- ✅ 5-7 culturas principais
- ✅ 3-4 pragas mais comuns
- ✅ Época de plantio por estação (verão, outono, inverno, primavera)

---

## ✨ Benefícios da Contextualização

### Sem contexto:
> "Para melhorar tomates, regue regularmente e aplique fertilizantes."

### Com contexto:
> "Em Campinas, SP, nesta primavera (22-28°C), com o latossolo vermelho da região que retém bem nutrientes, recomendo regar pela manhã aproveitando as chuvas de 1200-1800mm/ano típicas. Fique atento à mosca-branca comum nesta época em SP. Para suas vendas diretas semanais, plante escalonado para colheita contínua."

---

## 🎉 Conclusão

**TUDO ESTÁ PRONTO E FUNCIONAL!** ✅

O sistema já:
- ✅ Extrai época do ano automaticamente
- ✅ Identifica clima e solo por estado
- ✅ Considera perfil do agricultor
- ✅ Adapta recomendações à região e época
- ✅ Alerta sobre pragas comuns
- ✅ Personaliza para o canal de venda

Basta garantir que:
1. A variável `OPENAI_API_KEY` está configurada no `.env`
2. O backend está rodando
3. Os usuários completam o diagnóstico

**O chatbot já está contextualizado e funcionando!** 🚀🌱


