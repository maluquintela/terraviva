from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, get_current_farmer
from datetime import timedelta

router = APIRouter(prefix="/farmers", tags=["farmers"])

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Farmer, status_code=status.HTTP_201_CREATED)
def create_farmer(farmer: schemas.FarmerCreate, db: Session = Depends(get_db)):
    """Cadastrar novo agricultor"""
    # Verificar se já existe um agricultor com o mesmo email
    existing_farmer = db.query(models.Farmer).filter(models.Farmer.email == farmer.email).first()
    if existing_farmer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um agricultor com este email"
        )
    
    # Criar hash da senha
    hashed_password = get_password_hash(farmer.password)
    
    # Criar novo agricultor
    db_farmer = models.Farmer(
        name=farmer.name,
        email=farmer.email,
        password_hash=hashed_password,
        region=farmer.region,
        city=farmer.city,
        state=farmer.state,
        crops=farmer.crops,
        budget=farmer.budget,
        production_weekly=farmer.production_weekly,
        surplus=farmer.surplus,
        sale_preference=farmer.sale_preference,
        contact=farmer.contact
    )
    
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    
    return db_farmer

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
    
    db.commit()
    db.refresh(farmer)
    return farmer

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
