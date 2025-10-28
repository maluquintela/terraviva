from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal
import models
import schemas
from auth import get_current_farmer

router = APIRouter(prefix="/marketplace", tags=["marketplace"])

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========== PRODUTOS ==========

@router.post("/products", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    """Cadastrar novo produto no marketplace"""
    db_product = models.Product(
        name=product.name,
        category=product.category,
        unit=product.unit,
        description=product.description
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@router.get("/products", response_model=List[schemas.Product])
def list_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar todos os produtos cadastrados"""
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category.ilike(f"%{category}%"))
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Buscar produto por ID"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    return product

# ========== ANÚNCIOS (LISTINGS) ==========

@router.post("/listings", response_model=schemas.Listing, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing: schemas.ListingCreate,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Criar novo anúncio de excedente"""
    
    # Verificar se o farmer_id corresponde ao agricultor autenticado
    if listing.farmer_id != current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode criar anúncios em seu próprio nome"
        )
    
    # Verificar se o produto existe
    product = db.query(models.Product).filter(models.Product.id == listing.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado"
        )
    
    db_listing = models.Listing(
        farmer_id=listing.farmer_id,
        product_id=listing.product_id,
        quantity_total=listing.quantity_total,
        price=listing.price,
        city=listing.city,
        state=listing.state
    )
    
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    
    return db_listing

@router.get("/listings", response_model=List[schemas.ListingWithDetails])
def list_listings(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    state: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Listar anúncios ativos com filtros"""
    query = db.query(models.Listing).join(models.Farmer).join(models.Product)
    
    if city:
        query = query.filter(models.Listing.city.ilike(f"%{city}%"))
    
    if state:
        query = query.filter(models.Listing.state == state.upper())
    
    if status:
        query = query.filter(models.Listing.status == status)
    
    listings = query.offset(skip).limit(limit).all()
    
    # Converter para ListingWithDetails
    result = []
    for listing in listings:
        listing_dict = {
            "id": listing.id,
            "farmer_id": listing.farmer_id,
            "product_id": listing.product_id,
            "quantity_total": listing.quantity_total,
            "quantity_sold": listing.quantity_sold,
            "price": listing.price,
            "city": listing.city,
            "state": listing.state,
            "status": listing.status,
            "published_at": listing.published_at,
            "updated_at": listing.updated_at,
            "farmer": listing.farmer,
            "product": listing.product
        }
        result.append(schemas.ListingWithDetails(**listing_dict))
    
    return result

@router.get("/listings/{listing_id}", response_model=schemas.ListingWithDetails)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    """Buscar anúncio por ID"""
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anúncio não encontrado"
        )
    
    listing_dict = {
        "id": listing.id,
        "farmer_id": listing.farmer_id,
        "product_id": listing.product_id,
        "quantity_total": listing.quantity_total,
        "quantity_sold": listing.quantity_sold,
        "price": listing.price,
        "city": listing.city,
        "state": listing.state,
        "status": listing.status,
        "published_at": listing.published_at,
        "updated_at": listing.updated_at,
        "farmer": listing.farmer,
        "product": listing.product
    }
    
    return schemas.ListingWithDetails(**listing_dict)

@router.patch("/listings/{listing_id}", response_model=schemas.Listing)
def update_listing(
    listing_id: int,
    listing_update: schemas.ListingUpdate,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Atualizar anúncio (apenas o proprietário)"""
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anúncio não encontrado"
        )
    
    # Verificar se o agricultor é o proprietário do anúncio
    if listing.farmer_id != current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode atualizar seus próprios anúncios"
        )
    
    # Atualizar apenas os campos fornecidos
    update_data = listing_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)
    
    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/listings/{listing_id}")
def delete_listing(
    listing_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Deletar anúncio (apenas o proprietário)"""
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anúncio não encontrado"
        )
    
    # Verificar se o agricultor é o proprietário do anúncio
    if listing.farmer_id != current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode deletar seus próprios anúncios"
        )
    
    db.delete(listing)
    db.commit()
    return {"message": "Anúncio deletado com sucesso"}

# ========== COOPERATIVAS ==========

@router.post("/cooperatives", response_model=schemas.Cooperative, status_code=status.HTTP_201_CREATED)
def create_cooperative(
    cooperative: schemas.CooperativeCreate,
    db: Session = Depends(get_db)
):
    """Criar nova cooperativa"""
    db_cooperative = models.Cooperative(
        name=cooperative.name,
        main_product=cooperative.main_product,
        description=cooperative.description
    )
    
    db.add(db_cooperative)
    db.commit()
    db.refresh(db_cooperative)
    
    return db_cooperative

@router.get("/cooperatives", response_model=List[schemas.Cooperative])
def list_cooperatives(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Listar todas as cooperativas"""
    cooperatives = db.query(models.Cooperative).offset(skip).limit(limit).all()
    return cooperatives

@router.get("/cooperatives/{cooperative_id}", response_model=schemas.CooperativeWithMembers)
def get_cooperative(cooperative_id: int, db: Session = Depends(get_db)):
    """Buscar cooperativa por ID com membros"""
    cooperative = db.query(models.Cooperative).filter(models.Cooperative.id == cooperative_id).first()
    
    if not cooperative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cooperativa não encontrada"
        )
    
    # Buscar membros da cooperativa
    memberships = db.query(models.CooperativeMembership).filter(
        models.CooperativeMembership.cooperative_id == cooperative_id
    ).all()
    
    members = [membership.farmer for membership in memberships]
    
    cooperative_dict = {
        "id": cooperative.id,
        "name": cooperative.name,
        "main_product": cooperative.main_product,
        "description": cooperative.description,
        "created_at": cooperative.created_at,
        "members": members
    }
    
    return schemas.CooperativeWithMembers(**cooperative_dict)

@router.post("/cooperatives/{cooperative_id}/join")
def join_cooperative(
    cooperative_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Entrar em uma cooperativa"""
    
    # Verificar se a cooperativa existe
    cooperative = db.query(models.Cooperative).filter(models.Cooperative.id == cooperative_id).first()
    if not cooperative:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cooperativa não encontrada"
        )
    
    # Verificar se já é membro
    existing_membership = db.query(models.CooperativeMembership).filter(
        models.CooperativeMembership.farmer_id == current_farmer.id,
        models.CooperativeMembership.cooperative_id == cooperative_id
    ).first()
    
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você já é membro desta cooperativa"
        )
    
    # Criar nova associação
    membership = models.CooperativeMembership(
        farmer_id=current_farmer.id,
        cooperative_id=cooperative_id
    )
    
    db.add(membership)
    db.commit()
    
    return {"message": f"Você entrou na cooperativa {cooperative.name}"}

@router.delete("/cooperatives/{cooperative_id}/leave")
def leave_cooperative(
    cooperative_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """Sair de uma cooperativa"""
    
    # Buscar associação
    membership = db.query(models.CooperativeMembership).filter(
        models.CooperativeMembership.farmer_id == current_farmer.id,
        models.CooperativeMembership.cooperative_id == cooperative_id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Você não é membro desta cooperativa"
        )
    
    db.delete(membership)
    db.commit()
    
    return {"message": "Você saiu da cooperativa"}
