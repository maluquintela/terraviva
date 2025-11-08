import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH para importar o módulo database
project_root = Path(__file__).parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import SessionLocal, models, schemas
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

@router.get("/cooperatives/suggestions/{farmer_id}", response_model=List[schemas.CooperativeSuggestion])
def get_cooperative_suggestions(
    farmer_id: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Obter sugestões de agricultores compatíveis para formar cooperativas.
    
    A compatibilidade é calculada baseada em:
    - Mesma cidade ou estado
    - Culturas similares
    - Mesma preferência de venda
    - Excedentes compatíveis
    
    Exemplo de resposta:
    [
        {
            "farmer": {...},
            "compatibility_score": 0.85,
            "reasons": ["Mesma cidade", "Culturas similares"]
        }
    ]
    """
    if current_farmer.id != farmer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você só pode ver sugestões para seu próprio perfil"
        )
    
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Buscar todos os outros agricultores
    all_farmers = db.query(models.Farmer).filter(models.Farmer.id != farmer_id).all()
    
    suggestions = []
    for other_farmer in all_farmers:
        score = 0.0
        reasons = []
        
        # Verificar localização (mesma cidade = 0.4, mesmo estado = 0.2)
        if other_farmer.city == farmer.city:
            score += 0.4
            reasons.append("Mesma cidade")
        elif other_farmer.state == farmer.state:
            score += 0.2
            reasons.append("Mesmo estado")
        
        # Verificar culturas similares (0.3)
        if farmer.crops and other_farmer.crops:
            farmer_crops = set([c.strip().lower() for c in farmer.crops.split(",")])
            other_crops = set([c.strip().lower() for c in other_farmer.crops.split(",")])
            if farmer_crops & other_crops:  # Intersecção
                score += 0.3
                reasons.append("Culturas similares")
        
        # Verificar preferência de venda (0.2)
        if farmer.sale_preference == other_farmer.sale_preference:
            score += 0.2
            reasons.append(f"Mesma preferência de venda ({farmer.sale_preference})")
        
        # Verificar excedentes compatíveis (0.1)
        if farmer.surplus and other_farmer.surplus:
            if farmer.surplus.lower() in other_farmer.surplus.lower() or \
               other_farmer.surplus.lower() in farmer.surplus.lower():
                score += 0.1
                reasons.append("Excedentes compatíveis")
        
        if score > 0.3:  # Apenas sugerir se score > 30%
            suggestions.append(schemas.CooperativeSuggestion(
                farmer=other_farmer,
                compatibility_score=round(score, 2),
                reasons=reasons
            ))
    
    # Ordenar por score (maior primeiro)
    suggestions.sort(key=lambda x: x.compatibility_score, reverse=True)
    
    return suggestions[:10]  # Retornar top 10

# ========== MARKETPLACE SOCIAL ==========

@router.get("/feed", response_model=List[schemas.MarketplaceFeedItem])
def get_marketplace_feed(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Obter feed do marketplace com produtos e anúncios recentes.
    
    Retorna uma mistura de:
    - Produtos recentes
    - Anúncios ativos
    - Com informações dos agricultores
    
    Exemplo de resposta:
    [
        {
            "type": "listing",
            "listing": {...},
            "farmer": {...},
            "product": null
        }
    ]
    """
    feed_items = []
    
    # Buscar anúncios recentes
    listings = db.query(models.Listing).filter(
        models.Listing.status == "disponível"
    ).order_by(models.Listing.published_at.desc()).offset(skip).limit(limit // 2).all()
    
    for listing in listings:
        feed_items.append(schemas.MarketplaceFeedItem(
            type="listing",
            listing=listing,
            product=None,
            farmer=listing.farmer
        ))
    
    # Buscar produtos recentes
    products = db.query(models.Product).filter(
        models.Product.farmer_id.isnot(None)
    ).order_by(models.Product.created_at.desc()).offset(skip).limit(limit // 2).all()
    
    for product in products:
        feed_items.append(schemas.MarketplaceFeedItem(
            type="product",
            product=product,
            listing=None,
            farmer=product.farmer
        ))
    
    # Ordenar por data (mais recente primeiro)
    def get_date(item):
        if item.product:
            return item.product.created_at
        elif item.listing:
            return item.listing.published_at
        return None
    
    feed_items.sort(key=get_date, reverse=True)
    
    return feed_items[:limit]

@router.post("/follow/{farmer_id_to_follow}")
def follow_farmer(
    farmer_id_to_follow: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Seguir outro agricultor.
    
    Exemplo de resposta:
    {
        "message": "Agora você está seguindo João Silva"
    }
    """
    if current_farmer.id == farmer_id_to_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não pode seguir a si mesmo"
        )
    
    farmer_to_follow = db.query(models.Farmer).filter(
        models.Farmer.id == farmer_id_to_follow
    ).first()
    
    if not farmer_to_follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Verificar se já está seguindo
    if farmer_to_follow in current_farmer.following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você já está seguindo este agricultor"
        )
    
    # Adicionar à lista de seguindo
    current_farmer.following.append(farmer_to_follow)
    db.commit()
    
    return {"message": f"Agora você está seguindo {farmer_to_follow.name}"}

@router.delete("/follow/{farmer_id_to_unfollow}")
def unfollow_farmer(
    farmer_id_to_unfollow: int,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Deixar de seguir um agricultor.
    """
    if current_farmer.id == farmer_id_to_unfollow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não pode deixar de seguir a si mesmo"
        )
    
    farmer_to_unfollow = db.query(models.Farmer).filter(
        models.Farmer.id == farmer_id_to_unfollow
    ).first()
    
    if not farmer_to_unfollow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Verificar se está seguindo
    if farmer_to_unfollow not in current_farmer.following:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não está seguindo este agricultor"
        )
    
    # Remover da lista
    current_farmer.following.remove(farmer_to_unfollow)
    db.commit()
    
    return {"message": f"Você deixou de seguir {farmer_to_unfollow.name}"}

@router.get("/followers/{farmer_id}", response_model=schemas.FollowersResponse)
def get_followers(
    farmer_id: int,
    db: Session = Depends(get_db)
):
    """
    Obter lista de seguidores e seguindo de um agricultor.
    
    Exemplo de resposta:
    {
        "followers": [...],
        "following": [...],
        "total_followers": 5,
        "total_following": 3
    }
    """
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    return schemas.FollowersResponse(
        followers=list(farmer.followers),
        following=list(farmer.following),
        total_followers=len(farmer.followers),
        total_following=len(farmer.following)
    )

@router.get("/search")
def search_marketplace(
    query: str,
    db: Session = Depends(get_db)
):
    """
    Buscar produtos ou agricultores por nome, cidade ou cultura.
    
    Exemplo: /marketplace/search?query=milho
    """
    results = {
        "farmers": [],
        "products": [],
        "listings": []
    }
    
    # Buscar agricultores
    farmers = db.query(models.Farmer).filter(
        (models.Farmer.name.ilike(f"%{query}%")) |
        (models.Farmer.city.ilike(f"%{query}%")) |
        (models.Farmer.crops.ilike(f"%{query}%"))
    ).limit(10).all()
    results["farmers"] = farmers
    
    # Buscar produtos
    products = db.query(models.Product).filter(
        (models.Product.name.ilike(f"%{query}%")) |
        (models.Product.description.ilike(f"%{query}%"))
    ).limit(10).all()
    results["products"] = products
    
    # Buscar anúncios
    listings = db.query(models.Listing).join(models.Product).filter(
        (models.Product.name.ilike(f"%{query}%")) |
        (models.Listing.city.ilike(f"%{query}%"))
    ).limit(10).all()
    results["listings"] = listings
    
    return results
