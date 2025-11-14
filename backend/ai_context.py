"""
Módulo para contextualização da IA com base em dados do agricultor e região
"""

from datetime import datetime
from typing import Optional
import pytz
from database import models
from regional_data import get_region_info


def get_season_from_date(date_str: str) -> str:
    """
    Determina a estação do ano a partir de uma data ISO 8601
    Considera hemisfério sul (Brasil)
    
    Args:
        date_str: Data em formato ISO 8601 (ex: "2025-11-14T23:30:00.000Z")
    
    Returns:
        Nome da estação: "verão", "outono", "inverno" ou "primavera"
    """
    try:
        # Parse da data
        if date_str.endswith('Z'):
            date_str = date_str.replace('Z', '+00:00')
        
        sent_date = datetime.fromisoformat(date_str)
        month = sent_date.month
        
        # Estações do hemisfério sul
        if month in [12, 1, 2]:
            return "verão"
        elif month in [3, 4, 5]:
            return "outono"
        elif month in [6, 7, 8]:
            return "inverno"
        else:  # 9, 10, 11
            return "primavera"
    except Exception as e:
        print(f"Erro ao determinar estação: {e}")
        # Fallback para data atual
        month = datetime.now().month
        if month in [12, 1, 2]:
            return "verão"
        elif month in [3, 4, 5]:
            return "outono"
        elif month in [6, 7, 8]:
            return "inverno"
        else:
            return "primavera"


def get_month_name(date_str: str) -> str:
    """Retorna nome do mês em português"""
    months = {
        1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
        5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
        9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro"
    }
    try:
        if date_str.endswith('Z'):
            date_str = date_str.replace('Z', '+00:00')
        sent_date = datetime.fromisoformat(date_str)
        return months.get(sent_date.month, "")
    except:
        return months.get(datetime.now().month, "")


def build_context_prompt(
    farmer: models.Farmer,
    sent_at: Optional[str] = None
) -> str:
    """
    Constrói contexto detalhado para o ChatGPT baseado no perfil do agricultor
    
    Args:
        farmer: Objeto Farmer com dados do agricultor
        sent_at: Data/hora do envio em formato ISO 8601
    
    Returns:
        String com contexto formatado para o prompt
    """
    # Determinar época do ano
    season = get_season_from_date(sent_at) if sent_at else "não especificada"
    month_name = get_month_name(sent_at) if sent_at else ""
    
    # Obter informações regionais
    state = farmer.state or "SP"
    region_info = get_region_info(state)
    
    # Informações de temperatura por estação
    temp_info = region_info.get("temperatura_media", {}).get(season, "20-26°C")
    
    # Culturas apropriadas para a época
    culturas_epoca = region_info.get("epoca_plantio", {}).get(season, [])
    culturas_epoca_str = ", ".join(culturas_epoca) if culturas_epoca else "várias culturas"
    
    # Construir contexto
    context = f"""
CONTEXTO DO AGRICULTOR E REGIÃO:

📍 **Localização**: {farmer.city or "Não informado"}, {state} ({region_info['nome']})

🌡️ **Clima Regional**: {region_info['clima']}
   - Temperatura média atual ({season}): {temp_info}
   - Precipitação anual: {region_info['precipitacao_anual']}

🌱 **Solo da Região**: {region_info['solo_predominante']}

📅 **Época Atual**: {season.capitalize()} ({month_name})
   - Culturas recomendadas para esta época: {culturas_epoca_str}

🌾 **Culturas Principais da Região**: {', '.join(region_info['culturas_principais'])}

⚠️ **Pragas Comuns na Região**: {', '.join(region_info['pragas_comuns'])}

👤 **Perfil do Agricultor**:"""
    
    # Adicionar informações do diagnóstico se disponíveis
    if farmer.bio:
        context += f"\n   - Perfil de produção: {farmer.bio}"
    
    # ORÇAMENTO - CRUCIAL PARA RECOMENDAÇÕES ADEQUADAS
    if farmer.budget is not None:
        if farmer.budget <= 10:
            orcamento_str = f"Até R$10/mês (orçamento muito limitado)"
        elif farmer.budget <= 50:
            orcamento_str = f"R${farmer.budget}/mês (orçamento limitado)"
        elif farmer.budget <= 200:
            orcamento_str = f"R${farmer.budget}/mês (orçamento moderado)"
        elif farmer.budget <= 500:
            orcamento_str = f"R${farmer.budget}/mês (orçamento bom)"
        elif farmer.budget <= 1000:
            orcamento_str = f"R${farmer.budget}/mês (orçamento confortável)"
        else:
            orcamento_str = f"R${farmer.budget}/mês (orçamento flexível)"
        
        context += f"\n   - 💰 **Orçamento mensal para produção**: {orcamento_str}"
    
    # OBJETIVOS COMERCIAIS - Fundamental para orientar produção
    if farmer.cooperation_type or farmer.sale_target:
        context += f"\n\n🎯 **OBJETIVOS COMERCIAIS** (oriente a produção considerando isso):"
    
    if farmer.cooperation_type:
        tipo_cooperacao = {
            "semanal": "cooperações semanais",
            "longo_prazo": "cooperações de longo prazo"
        }.get(farmer.cooperation_type, farmer.cooperation_type)
        context += f"\n   - Frequência de cooperação: {tipo_cooperacao}"
        
        # Adicionar orientações específicas por tipo
        if farmer.cooperation_type == "semanal":
            context += "\n     → Precisa de PRODUÇÃO CONTÍNUA e DIVERSIFICADA"
            context += "\n     → Colheitas frequentes, menor volume por vez"
            context += "\n     → Culturas de ciclo curto e escalonadas"
        elif farmer.cooperation_type == "longo_prazo":
            context += "\n     → Pode focar em CULTURAS PERENES e de maior escala"
            context += "\n     → Contratos de longo prazo e fornecimento regular"
            context += "\n     → Investimento em infraestrutura vale mais a pena"
    
    if farmer.sale_target:
        tipo_venda = {
            "direta": "vendas diretas ao consumidor",
            "mercados": "vendas a mercados e varejo",
            "institucional": "vendas institucionais",
            "digital": "vendas por canais digitais"
        }.get(farmer.sale_target, farmer.sale_target)
        context += f"\n   - Canal de venda preferido: {tipo_venda}"
        
        # Adicionar estratégias específicas por canal
        if farmer.sale_target == "direta":
            context += "\n     → Foco em QUALIDADE, VARIEDADE e APRESENTAÇÃO"
            context += "\n     → Produtos frescos, orgânicos, diferenciados"
            context += "\n     → Relacionamento direto com clientes (feiras, cestas)"
        elif farmer.sale_target == "mercados":
            context += "\n     → Foco em VOLUME, PADRONIZAÇÃO e LOGÍSTICA"
            context += "\n     → Produtos uniformes, embalagem adequada"
            context += "\n     → Negociação de preço e prazos de entrega"
        elif farmer.sale_target == "institucional":
            context += "\n     → Foco em ESCALA, DOCUMENTAÇÃO e REGULARIDADE"
            context += "\n     → Contratos formais, notas fiscais, certificações"
            context += "\n     → Fornecimento constante em grande volume"
        elif farmer.sale_target == "digital":
            context += "\n     → Foco em MARKETING, FOTOS e ENTREGA"
            context += "\n     → Produtos fotogênicos, embalagem bonita"
            context += "\n     → Presença em redes sociais, delivery, e-commerce"
    
    # Adicionar observações importantes
    budget_note = ""
    if farmer.budget is not None:
        if farmer.budget <= 50:
            budget_note = "\n- ⚠️ **PRIORIZE soluções de BAIXO CUSTO ou GRATUITAS** (orçamento limitado)"
        elif farmer.budget <= 200:
            budget_note = "\n- Sugira soluções econômicas e de custo moderado"
        elif farmer.budget <= 500:
            budget_note = "\n- Pode sugerir investimentos moderados se trouxerem bom retorno"
        else:
            budget_note = "\n- Pode sugerir investimentos mais substanciais com bom retorno"
    
    context += f"""

💡 **IMPORTANTE - ORIENTE A PRODUÇÃO CONSIDERANDO**:
- As condições climáticas típicas do {season} em {state}
- O tipo de solo predominante na região
- As pragas comuns desta época e região
- **OS OBJETIVOS COMERCIAIS do agricultor** (tipo de cooperação e canal de venda)
- Sugestões de culturas, variedades e práticas que ATENDAM aos objetivos de venda{budget_note}
"""
    
    return context


def build_system_prompt() -> str:
    """
    Constrói o prompt de sistema para o ChatGPT
    Define o papel e comportamento da IA
    """
    return """Você é um agrônomo especialista brasileiro da plataforma TerraViva, com vasta experiência em agricultura familiar e sustentável.

SUAS CARACTERÍSTICAS:
- Especialista em todas as regiões do Brasil
- Profundo conhecimento de clima, solo e culturas regionais
- Experiência com pequenos e médios produtores
- Foco em práticas sustentáveis e orgânicas
- Linguagem acessível e didática

SUAS RESPOSTAS DEVEM:
✓ Ser práticas e aplicáveis imediatamente
✓ Considerar o clima, solo e época do ano da região específica
✓ Adaptar-se ao nível de experiência do agricultor
✓ **RESPEITAR SEMPRE o orçamento mensal informado pelo agricultor**
✓ **ALINHAR recomendações aos OBJETIVOS COMERCIAIS do agricultor**:
  • Cooperações semanais → Sugira culturas de ciclo curto, produção escalonada, diversidade
  • Cooperações longo prazo → Sugira culturas perenes, maior escala, infraestrutura
  • Vendas diretas → Foque em qualidade, variedade, produtos diferenciados
  • Vendas a mercados → Foque em volume, padronização, logística
  • Vendas institucionais → Foque em escala, documentação, regularidade
  • Vendas digitais → Foque em apresentação, fotos, marketing
✓ Incluir o "porquê" das recomendações (educação)
✓ Priorizar soluções de baixo custo, especialmente para orçamentos limitados
✓ Para orçamentos até R$50: sugerir APENAS soluções gratuitas ou muito baratas
✓ Mencionar práticas sustentáveis e orgânicas
✓ Alertar sobre pragas e doenças comuns da região/época
✓ Indicar custo aproximado de cada recomendação quando relevante
✓ Explicar como a recomendação ajuda a ATINGIR OS OBJETIVOS DE VENDA
✓ Ser objetivas (máximo 400 palavras)
✓ Usar português brasileiro informal mas respeitoso

FORMATO DA RESPOSTA:
1. Responda direto a pergunta
2. Dê 2-4 recomendações práticas numeradas
3. Explique brevemente o porquê de cada uma
4. Se relevante, alerte sobre cuidados específicos da época/região

NÃO faça:
✗ Recomendações genéricas que não considerem o contexto
✗ Sugestões de produtos químicos sem alternativas orgânicas
✗ Respostas muito técnicas ou acadêmicas
✗ Textos longos (máximo 400 palavras)"""


def build_user_prompt(
    question: str,
    farmer: models.Farmer,
    sent_at: Optional[str] = None,
    image_analysis: Optional[str] = None
) -> str:
    """
    Constrói o prompt do usuário com contexto completo
    
    Args:
        question: Pergunta do agricultor
        farmer: Objeto Farmer com dados do agricultor
        sent_at: Data/hora do envio
        image_analysis: Análise de imagem anexada (se houver)
    
    Returns:
        Prompt formatado para o ChatGPT
    """
    # Construir contexto
    context = build_context_prompt(farmer, sent_at)
    
    # Adicionar análise de imagem se disponível
    image_context = ""
    if image_analysis:
        image_context = f"""

📷 **ANÁLISE DA IMAGEM ENVIADA**:
{image_analysis}
"""
    
    # Construir prompt final com ênfase no orçamento e objetivos comerciais
    budget_reminder = ""
    if farmer.budget is not None:
        if farmer.budget <= 50:
            budget_reminder = f"\n- ⚠️ **CRÍTICO**: O orçamento é de apenas R${farmer.budget}/mês - sugira SOMENTE soluções gratuitas ou extremamente baratas"
        elif farmer.budget <= 200:
            budget_reminder = f"\n- **Importante**: Orçamento limitado de R${farmer.budget}/mês - priorize soluções econômicas"
        else:
            budget_reminder = f"\n- Orçamento disponível: R${farmer.budget}/mês - pode sugerir investimentos com bom retorno"
    
    # Adicionar lembrete sobre objetivos comerciais
    commercial_reminder = ""
    if farmer.cooperation_type or farmer.sale_target:
        commercial_reminder = "\n- 🎯 **ESSENCIAL**: Explique como suas recomendações ajudam o agricultor a ATINGIR SEUS OBJETIVOS COMERCIAIS"
        
        if farmer.cooperation_type == "semanal":
            commercial_reminder += " (produção contínua e diversificada para entregas semanais)"
        elif farmer.cooperation_type == "longo_prazo":
            commercial_reminder += " (produção em escala para contratos de longo prazo)"
        
        if farmer.sale_target == "direta":
            commercial_reminder += " focando em qualidade e diferenciação para venda direta ao consumidor"
        elif farmer.sale_target == "mercados":
            commercial_reminder += " focando em volume e padronização para mercados e varejo"
        elif farmer.sale_target == "institucional":
            commercial_reminder += " focando em escala e documentação para vendas institucionais"
        elif farmer.sale_target == "digital":
            commercial_reminder += " focando em apresentação e marketing para vendas digitais"
    
    user_prompt = f"""{context}
{image_context}

❓ **PERGUNTA DO AGRICULTOR**:
"{question}"

Por favor, forneça uma resposta completa, prática e contextualizada considerando:
- A região específica ({farmer.state})
- A época do ano atual
- As condições climáticas típicas desta época
- O perfil de produção do agricultor{budget_reminder}{commercial_reminder}
"""
    
    return user_prompt


def get_chatgpt_prompts(
    question: str,
    farmer: models.Farmer,
    sent_at: Optional[str] = None,
    image_analysis: Optional[str] = None
) -> dict:
    """
    Função principal para obter os prompts formatados para o ChatGPT
    
    Args:
        question: Pergunta do agricultor
        farmer: Objeto Farmer
        sent_at: Data/hora em ISO 8601
        image_analysis: Análise de imagem opcional
    
    Returns:
        Dict com 'system' e 'user' prompts
    """
    return {
        "system": build_system_prompt(),
        "user": build_user_prompt(question, farmer, sent_at, image_analysis)
    }

