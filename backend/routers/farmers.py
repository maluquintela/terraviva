import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, models, schemas
from backend.auth import get_password_hash, verify_password, create_access_token, get_current_farmer
from datetime import timedelta
import json

router = APIRouter(prefix="/farmers", tags=["farmers"])

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[schemas.Farmer])
def list_farmers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos os agricultores"""
    farmers = db.query(models.Farmer).offset(skip).limit(limit).all()
    return farmers

@router.get("/{farmer_id}", response_model=schemas.Farmer)
def get_farmer(farmer_id: int, db: Session = Depends(get_db)):
    """Buscar agricultor por ID"""
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    return farmer

@router.put("/{farmer_id}", response_model=schemas.Farmer)
def update_farmer(
    farmer_id: int, 
    farmer_update: schemas.FarmerUpdate, 
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Atualizar dados do agricultor (apenas o próprio agricultor pode atualizar)"""
    if current_farmer.id != farmer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode atualizar seus próprios dados"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Atualizar apenas os campos fornecidos
    update_data = farmer_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(farmer, field, value)
    
    # Atualizar biografia automaticamente após mudanças
    farmer.update_bio()
    
    db.commit()
    db.refresh(farmer)
    return farmer

@router.patch("/{farmer_id}/update_profile", response_model=schemas.Farmer)
def update_profile(
    farmer_id: int,
    farmer_update: schemas.FarmerUpdate,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Atualizar perfil do agricultor (city, state, crops, budget, surplus, sale_preference)
    Atualiza automaticamente a biografia após as mudanças.
    
    Exemplo de resposta:
    {
        "id": 1,
        "name": "João",
        "city": "Patos",
        "state": "PB",
        "crops": "milho, feijão",
        "bio": "João cultiva milho e feijão em Patos, PB. Prefere vender diretamente ao consumidor..."
    }
    """
    if current_farmer.id != farmer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode atualizar seu próprio perfil"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Campos permitidos para atualização de perfil
    allowed_fields = ['city', 'state', 'crops', 'budget', 'surplus', 'sale_preference', 'contact']
    update_data = farmer_update.dict(exclude_unset=True)
    
    # Filtrar apenas campos permitidos
    for field, value in update_data.items():
        if field in allowed_fields:
            setattr(farmer, field, value)
    
    # Atualizar biografia automaticamente
    farmer.update_bio()
    
    db.commit()
    db.refresh(farmer)
    return farmer

@router.post("/{farmer_id}/diagnose", response_model=schemas.DiagnosticResponse)
def diagnose_farmer(
    farmer_id: int,
    diagnostic: schemas.DiagnosticRequest,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Realizar diagnóstico inicial do agricultor e gerar biografia automaticamente.
    
    Este endpoint:
    - Atualiza os dados do agricultor com as informações do diagnóstico
    - Gera automaticamente uma biografia descritiva
    - Cria um perfil de diagnóstico em JSON
    
    Exemplo de resposta:
    {
        "farmer_id": 1,
        "bio": "João cultiva milho e feijão em Patos, PB. Prefere vender diretamente ao consumidor...",
        "diagnostic_profile": "{\"city\": \"Patos\", \"state\": \"PB\", ...}",
        "message": "Diagnóstico realizado com sucesso!"
    }
    """
    if current_farmer.id != farmer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode fazer diagnóstico em seu próprio perfil"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Atualizar dados do diagnóstico
    farmer.city = diagnostic.city
    farmer.state = diagnostic.state
    farmer.crops = diagnostic.crops
    farmer.budget = diagnostic.budget
    farmer.production_weekly = diagnostic.production_weekly
    farmer.surplus = diagnostic.surplus
    
    # Atualizar sale_preference (compatibilidade com sale_target do frontend)
    if diagnostic.sale_target:
        farmer.sale_preference = diagnostic.sale_target
    elif diagnostic.sale_preference:
        farmer.sale_preference = diagnostic.sale_preference
    
    # Atualizar cooperation_type
    if diagnostic.cooperation_type:
        farmer.cooperation_type = diagnostic.cooperation_type
    
    farmer.contact = diagnostic.contact
    
    # Atualizar bio se fornecida
    if diagnostic.bio:
        farmer.bio = diagnostic.bio
    
    # Criar perfil de diagnóstico em JSON
    diagnostic_profile = {
        "city": diagnostic.city,
        "state": diagnostic.state,
        "crops": diagnostic.crops,
        "budget": diagnostic.budget,
        "production_weekly": diagnostic.production_weekly,
        "surplus": diagnostic.surplus,
        "sale_preference": diagnostic.sale_target or diagnostic.sale_preference,
        "cooperation_type": diagnostic.cooperation_type,
        "contact": diagnostic.contact
    }
    farmer.diagnostic_profile = json.dumps(diagnostic_profile, ensure_ascii=False)
    
    # Gerar biografia automaticamente se não foi fornecida
    if not diagnostic.bio:
        farmer.update_bio()
    
    db.commit()
    db.refresh(farmer)
    
    # Log de debug para confirmar salvamento
    print(f"\n✅ DIAGNÓSTICO SALVO COM SUCESSO:")
    print(f"   Farmer ID: {farmer.id}")
    print(f"   Cidade: {farmer.city}, {farmer.state}")
    print(f"   Orçamento: R$ {farmer.budget}")
    print(f"   Culturas: {farmer.crops}")
    print(f"   Tipo de cooperação: {farmer.cooperation_type}")
    print(f"   Canal de venda: {farmer.sale_preference}")
    print(f"   Bio: {farmer.bio}")
    print(f"\n")
    
    return schemas.DiagnosticResponse(
        farmer_id=farmer.id,
        bio=farmer.bio or "",
        diagnostic_profile=farmer.diagnostic_profile or "",
        message="Diagnóstico realizado com sucesso! Biografia gerada automaticamente."
    )

@router.delete("/{farmer_id}")
def delete_farmer(
    farmer_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Deletar agricultor (apenas o próprio agricultor pode deletar)"""
    if current_farmer.id != farmer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode deletar sua própria conta"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    db.delete(farmer)
    db.commit()
    return {"message": "Agricultor deletado com sucesso"}

@router.post("/login", response_model=schemas.Token)
def login(login_request: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Autenticação do agricultor"""
    farmer = db.query(models.Farmer).filter(models.Farmer.email == login_request.email).first()
    
    if not farmer or not verify_password(login_request.password, farmer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(farmer.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me/profile", response_model=schemas.Farmer)
def get_my_profile(current_farmer: models.Farmer = Depends(get_current_farmer)):
    """Obter perfil do agricultor autenticado"""
    return current_farmer
