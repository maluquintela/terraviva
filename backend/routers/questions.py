import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Tuple
import os
from database import SessionLocal, models, schemas
from auth import get_current_farmer
from dotenv import load_dotenv

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

def get_ai_response(question: str, farmer_context: models.Farmer = None) -> Tuple[str, float]:
    """Obter resposta da IA usando OpenAI GPT-4"""
    try:
        # Usar OpenAI real
        from openai import OpenAI
        
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or api_key == "sua_chave_openai_aqui":
            # Fallback para resposta simulada se não houver chave
            return f"""Olá! Sobre sua pergunta: "{question}"

Como agrônomo experiente, posso te ajudar! Para uma resposta completa à sua dúvida, é importante observar:
1. Quais são as condições específicas do seu plantio?
2. Em qual região você está?
3. Há quanto tempo essa situação está ocorrendo?

Se possível, compartilhe mais detalhes para uma orientação mais precisa. Enquanto isso, continue observando suas plantas e tomando notas."""
        
        client = OpenAI(api_key=api_key)
        
        # Construir contexto do agricultor se disponível
        context = ""
        if farmer_context:
            context = f"""
Contexto do agricultor:
- Localização: {farmer_context.city}, {farmer_context.state}
- Culturas: {farmer_context.crops or 'Não informado'}
- Preferência de venda: {farmer_context.sale_preference}
"""
        
        prompt = f"""Você é um agrônomo experiente que auxilia agricultores familiares brasileiros. 
        Dê respostas simples, práticas e sustentáveis, explicando o porquê das recomendações.
        Use o tom e contexto regional do agricultor quando fornecido.
        {context}
        Pergunta do agricultor: {question}
        
        Responda de forma clara e didática, como se estivesse conversando diretamente com o agricultor."""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você é um agrônomo experiente especializado em agricultura familiar brasileira."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content.strip()
        confidence = 0.92  # Poderia ser calculado baseado na resposta
        return answer, confidence
    
    except Exception as e:
        # Se falhar, retornar resposta genérica
        answer = f"""Olá! Sobre sua pergunta: "{question}"

Como agrônomo, posso orientar que:
1. Monitore regularmente suas plantas
2. Mantenha o solo bem nutrido com matéria orgânica
3. Observe as condições de luz e umidade
4. Registre mudanças para acompanhamento

Para uma resposta mais específica, compartilhe mais detalhes sobre sua situação."""
        return answer, 0.5

@router.post("/", response_model=schemas.QuestionResponse)
def ask_question(
    question: schemas.QuestionCreate,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Enviar pergunta para a IA e obter resposta"""
    
    # Verificar se o farmer_id corresponde ao agricultor autenticado
    if question.farmer_id != current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode fazer perguntas em seu próprio nome"
        )
    
    # Obter resposta da IA
    farmer = db.query(models.Farmer).filter(models.Farmer.id == question.farmer_id).first()
    ai_response, confidence = get_ai_response(question.question_text, farmer)
    
    # Criar registro da pergunta no banco
    db_question = models.Question(
        farmer_id=question.farmer_id,
        question_text=question.question_text,
        answer_text=ai_response
    )
    
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    # Sem geração de áudio por enquanto
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
    response_text, confidence = get_ai_response(request.question, farmer)
    
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
