from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
from database import SessionLocal
import models
import schemas
from auth import get_current_farmer
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/questions", tags=["consultoria-ia"])

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_ai_response(question: str) -> str:
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
        
        prompt = f"""Você é um agrônomo experiente que auxilia agricultores familiares brasileiros. 
        Dê respostas simples, práticas e sustentáveis, explicando o porquê das recomendações.
        
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
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        # Se falhar, retornar resposta genérica
        return f"""Olá! Sobre sua pergunta: "{question}"

Como agrônomo, posso orientar que:
1. Monitore regularmente suas plantas
2. Mantenha o solo bem nutrido com matéria orgânica
3. Observe as condições de luz e umidade
4. Registre mudanças para acompanhamento

Para uma resposta mais específica, compartilhe mais detalhes sobre sua situação."""

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
    ai_response = get_ai_response(question.question_text)
    
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
