import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Tuple, Optional
import os
from database import SessionLocal, models, schemas
from auth import get_current_farmer
from dotenv import load_dotenv
from ai_context import get_chatgpt_prompts

load_dotenv()

router = APIRouter(prefix="/questions", tags=["consultoria-ia"])
ai_router = APIRouter(prefix="/ai", tags=["ia-agricola"])

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_ai_response(
    question: str,
    farmer_context: models.Farmer = None,
    sent_at: Optional[str] = None,
    image_analysis: Optional[str] = None
) -> Tuple[str, float]:
    """
    Obter resposta contextualizada da IA usando OpenAI GPT-4
    
    Args:
        question: Pergunta do agricultor
        farmer_context: Dados do agricultor
        sent_at: Data/hora do envio (ISO 8601)
        image_analysis: Análise de imagem anexada (opcional)
    
    Returns:
        Tuple (resposta, confiança)
    """
    try:
        # Usar OpenAI real
        from openai import OpenAI
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "sua_chave_openai_aqui":
            # Fallback para resposta simulada se não houver chave
            season = ""
            if sent_at:
                from ai_context import get_season_from_date
                season = f" nesta época de {get_season_from_date(sent_at)}"
            
            location = ""
            if farmer_context and farmer_context.city and farmer_context.state:
                location = f" em {farmer_context.city}, {farmer_context.state}"
            
            return f"""Olá{location}! Sobre sua pergunta{season}: "{question}"

Como agrônomo experiente, posso te ajudar! Para uma resposta completa à sua dúvida, é importante observar:
1. Quais são as condições específicas do seu plantio?
2. Como está o clima e o solo na sua região?
3. Há quanto tempo essa situação está ocorrendo?

Se possível, compartilhe mais detalhes para uma orientação mais precisa. Enquanto isso, continue observando suas plantas e tomando notas.""", 0.5
        
        client = OpenAI(api_key=api_key)
        
        # Construir prompts contextualizados usando o novo sistema
        if farmer_context:
            prompts = get_chatgpt_prompts(
                question=question,
                farmer=farmer_context,
                sent_at=sent_at,
                image_analysis=image_analysis
            )
        else:
            # Fallback se não houver contexto do agricultor
            prompts = {
                "system": "Você é um agrônomo experiente especializado em agricultura familiar brasileira.",
                "user": f"Pergunta do agricultor: {question}\n\nResponda de forma clara e didática."
            }
        
        # Chamada ao ChatGPT com contexto completo
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompts["system"]},
                {"role": "user", "content": prompts["user"]}
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content.strip()
        confidence = 0.92  # Poderia ser calculado baseado na resposta
        return answer, confidence
    
    except Exception as e:
        print(f"Erro ao obter resposta da IA: {e}")
        # Se falhar, retornar resposta genérica contextualizada
        location_str = ""
        if farmer_context and farmer_context.city and farmer_context.state:
            location_str = f" para sua região de {farmer_context.city}, {farmer_context.state}"
        
        answer = f"""Olá! Sobre sua pergunta: "{question}"

Como agrônomo{location_str}, posso orientar que:
1. Monitore regularmente suas plantas e o clima local
2. Mantenha o solo bem nutrido com matéria orgânica
3. Observe as condições de luz e umidade típicas da sua região
4. Registre mudanças para acompanhamento

Para uma resposta mais específica, compartilhe mais detalhes sobre sua situação."""
        return answer, 0.5

@router.post("/", response_model=schemas.QuestionResponse)
async def ask_question(
    question_text: str = Form(...),
    sent_at: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Enviar pergunta para a IA e obter resposta contextualizada
    
    Aceita:
    - question_text: Pergunta
    - sent_at: Data/hora do envio (ISO 8601) - usado para determinar época do ano
    - image: Imagem opcional (foto da plantação, praga, etc)
    
    O farmer_id é obtido automaticamente do token de autenticação
    """
    
    # Usar o farmer autenticado
    farmer = current_farmer
    farmer_id = farmer.id
    
    # Processar imagem se enviada (placeholder - implementar análise de imagem futuramente)
    image_analysis = None
    image_url = None
    if image:
        # TODO: Implementar análise de imagem com Vision API ou similar
        # Por enquanto, apenas mencionar que há uma imagem
        image_analysis = f"Imagem anexada: {image.filename}"
        # TODO: Salvar imagem e obter URL
        image_url = None
    
    # Obter resposta contextualizada da IA
    ai_response, confidence = get_ai_response(
        question=question_text,
        farmer_context=farmer,
        sent_at=sent_at,
        image_analysis=image_analysis
    )
    
    # Criar registro da pergunta no banco
    db_question = models.Question(
        farmer_id=farmer_id,
        question_text=question_text,
        answer_text=ai_response
    )
    
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    # Retornar resposta
    return schemas.QuestionResponse(
        question=db_question,
        answer_text=ai_response,
        audio_url=None
    )

@router.get("/history/{farmer_id}", response_model=List[schemas.Question])
def get_question_history(
    farmer_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Obter histórico de perguntas de um agricultor"""
    
    # Verificar se o farmer_id corresponde ao agricultor autenticado
    if farmer_id != current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode ver seu próprio histórico"
        )
    
    questions = db.query(models.Question).filter(
        models.Question.farmer_id == farmer_id
    ).order_by(models.Question.created_at.desc()).all()
    
    return questions


@router.get("/history", response_model=List[schemas.Question])
def get_my_question_history(
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Obter histórico do agricultor autenticado (sem precisar passar ID)"""
    questions = db.query(models.Question).filter(
        models.Question.farmer_id == current_farmer.id
    ).order_by(models.Question.created_at.desc()).all()
    
    return questions

@router.get("/", response_model=List[schemas.Question])
def list_all_questions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Listar todas as perguntas (para administração)"""
    questions = db.query(models.Question).offset(skip).limit(limit).all()
    return questions

# ========== NOVOS ENDPOINTS DE IA ==========

@ai_router.post("/diagnose", response_model=schemas.AIDiagnoseResponse)
def ai_diagnose(
    request: schemas.AIDiagnoseRequest,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Diagnóstico via IA - recebe texto/áudio do agricultor e retorna resposta textual.
    
    A IA usa o contexto do agricultor (localização, culturas, etc) para dar respostas mais personalizadas.
    
    Exemplo de resposta:
    {
        "response": "Misture 1 litro de água, 2 colheres de sabão neutro e um fio de óleo de cozinha...",
        "confidence": 0.92
    }
    """
    if request.farmer_id != current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode fazer diagnóstico em seu próprio nome"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == request.farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Obter resposta da IA com contexto do agricultor
    from datetime import datetime
    sent_at = datetime.now().isoformat()
    response_text, confidence = get_ai_response(
        question=request.question,
        farmer_context=farmer,
        sent_at=sent_at
    )
    
    # Salvar no histórico
    db_question = models.Question(
        farmer_id=request.farmer_id,
        question_text=request.question,
        answer_text=response_text
    )
    db.add(db_question)
    db.commit()
    
    return schemas.AIDiagnoseResponse(
        response=response_text,
        confidence=confidence
    )

@ai_router.get("/recommendations/{farmer_id}", response_model=schemas.AIRecommendationResponse)
def get_ai_recommendations(
    farmer_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Obter recomendações personalizadas da IA baseadas no perfil do agricultor.
    
    Usa o diagnostic_profile para sugerir:
    - Boas práticas agrícolas
    - Manejo de culturas
    - Parceiros/com cooperativas
    
    Exemplo de resposta:
    {
        "recommendations": [
            "Considere usar compostagem para melhorar a fertilidade do solo",
            "Você pode formar uma cooperativa com outros produtores de milho na região"
        ],
        "based_on": "Perfil de diagnóstico: Patos, PB, cultiva milho e feijão"
    }
    """
    if current_farmer.id != farmer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode ver recomendações para seu próprio perfil"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Gerar recomendações baseadas no perfil
    recommendations = []
    
    # Recomendações baseadas em culturas
    if farmer.crops:
        crops_list = [c.strip() for c in farmer.crops.split(",")]
        recommendations.append(f"Para {crops_list[0]}, considere fazer rotação de culturas para preservar o solo")
    
    # Recomendações baseadas em localização
    if farmer.city and farmer.state:
        recommendations.append(f"Produtores em {farmer.city}, {farmer.state} podem se beneficiar de cooperativas locais")
    
    # Recomendações baseadas em preferência de venda
    if farmer.sale_preference == "direta":
        recommendations.append("Venda direta permite melhor margem de lucro. Considere feiras locais")
    elif farmer.sale_preference == "digital":
        recommendations.append("Plataformas digitais podem expandir seu alcance. Mantenha fotos atualizadas dos produtos")
    
    # Recomendações baseadas em orçamento
    if farmer.budget and farmer.budget < 1000:
        recommendations.append("Com orçamento limitado, foque em práticas de baixo custo como compostagem e sementes crioulas")
    
    # Se não houver perfil de diagnóstico, sugerir criar
    if not farmer.diagnostic_profile:
        recommendations.insert(0, "Complete seu diagnóstico inicial para receber recomendações mais personalizadas")
    
    based_on = f"Perfil: {farmer.city}, {farmer.state}" if farmer.city else "Perfil básico"
    if farmer.crops:
        based_on += f", cultiva {farmer.crops}"
    
    return schemas.AIRecommendationResponse(
        recommendations=recommendations[:5],  # Limitar a 5 recomendações
        based_on=based_on
    )
