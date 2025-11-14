"""
Router para funcionalidades sociais: Feed tipo Tinder, Chat/DM, Recomendações
"""

import sys
from pathlib import Path
from datetime import datetime
from typing import List, Optional
import random
import math

project_root = Path(__file__).parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from database import SessionLocal, models, schemas
from auth import get_current_farmer

router = APIRouter(prefix="/social", tags=["social-tinder-chat"])

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ========== FEED TIPO TINDER (RECOMENDAÇÕES) ==========

def calculate_compatibility(farmer1: models.Farmer, farmer2: models.Farmer) -> dict:
    """
    Calcula compatibilidade entre dois agricultores (algoritmo de match)
    
    Retorna score de 0-100 baseado em:
    - Mesmo ESTADO (prioridade máxima): 40 pontos
    - Interesses comerciais compatíveis: 30 pontos
    - Produtos complementares: 20 pontos
    - Excedente disponível: 10 pontos
    """
    score = 0
    reasons = []
    shared_products = []
    complementary = []
    
    # PRIORIDADE 1: Mesmo estado: +40 pontos (AUMENTADO)
    if farmer1.state == farmer2.state:
        score += 40
        reasons.append(f"Mesmo estado: {farmer1.state}")
        
        # Mesma cidade: +10 pontos adicionais
        if farmer1.city == farmer2.city:
            score += 10
            reasons.append(f"Mesma cidade: {farmer1.city}")
    
    # PRIORIDADE 2: Interesses comerciais compatíveis: até 30 pontos
    commercial_score = 0
    
    # Tipo de cooperação compatível
    if farmer1.cooperation_type and farmer2.cooperation_type:
        if farmer1.cooperation_type == farmer2.cooperation_type:
            commercial_score += 15
            reasons.append(f"Mesmo tipo de cooperação: {farmer1.cooperation_type}")
    
    # Alvo de venda compatível
    if farmer1.sale_target and farmer2.sale_target:
        if farmer1.sale_target == farmer2.sale_target:
            commercial_score += 15
            reasons.append(f"Mesmo mercado alvo: {farmer1.sale_target}")
    
    score += commercial_score
    
    # PRIORIDADE 3: Produtos
    crops1 = set([c.strip().lower() for c in farmer1.crops.split(",")]) if farmer1.crops else set()
    crops2 = set([c.strip().lower() for c in farmer2.crops.split(",")]) if farmer2.crops else set()
    
    # Produtos em comum
    common = crops1.intersection(crops2)
    if common:
        shared_products = list(common)
        score += min(len(common) * 5, 15)  # Máx 15 pontos
        reasons.append(f"{len(common)} produtos em comum")
    
    # Produtos complementares (diferentes mas compatíveis)
    different = crops1.symmetric_difference(crops2)
    if different and len(different) > 1:
        complementary = list(different)[:3]  # Top 3
        score += 5
        reasons.append(f"Produtos complementares para diversificar")
    
    # PRIORIDADE 4: Tem excedente: +10 pontos
    if farmer2.surplus and farmer2.surplus != "0":
        score += 10
        reasons.append("Tem excedente disponível")
    
    # Limitar score a 100
    score = min(score, 100)
    
    return {
        "score": score,
        "reasons": reasons,
        "shared_products": shared_products,
        "complementary_products": complementary
    }

@router.get("/feed")
def get_feed_recommendations(
    limit: int = 10,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Feed tipo Tinder: Recomendações personalizadas de produtores compatíveis
    
    Mostra agricultores próximos com produtos complementares,
    ordenados por score de compatibilidade (match).
    
    Retorna cards estilo Tinder para o usuário decidir se quer conversar.
    """
    
    # Buscar todos os outros agricultores (exceto o usuário atual)
    other_farmers = db.query(models.Farmer).filter(
        models.Farmer.id != current_farmer.id
    ).all()
    
    # Calcular compatibilidade com cada um
    recommendations = []
    for farmer in other_farmers:
        compat = calculate_compatibility(current_farmer, farmer)
        
        # Só mostrar se tiver score mínimo de 20
        if compat["score"] >= 20:
            # Distância (mockado por enquanto)
            distance = "10-50 km" if farmer.city == current_farmer.city else "50-100 km"
            
            # Highlight baseado no score
            if compat["score"] >= 80:
                highlight = f"🔥 {compat['score']}% compatível! Match perfeito!"
            elif compat["score"] >= 60:
                highlight = f"✨ {compat['score']}% compatível - Ótima opção!"
            else:
                highlight = f"👍 {compat['score']}% compatível"
            
            recommendations.append({
                "farmer": farmer,
                "match_score": compat["score"],
                "distance": distance,
                "products_in_common": compat["shared_products"],
                "can_complement": compat["complementary_products"],
                "highlight": highlight,
                "reasons": compat["reasons"]
            })
    
    # Ordenar por score (maiores primeiro)
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return recommendations[:limit]

@router.get("/farmers/{farmer_id}/profile")
def get_farmer_public_profile(
    farmer_id: int,
    db: Session = Depends(get_db)
):
    """
    Perfil público do agricultor (para visualizar antes de conversar)
    
    Mostra todas as informações do produtor de forma pública.
    """
    farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    # Buscar produtos/anúncios do agricultor
    listings = db.query(models.Listing).filter(
        models.Listing.farmer_id == farmer_id,
        models.Listing.status == "disponível"
    ).limit(5).all()
    
    return {
        "farmer": farmer,
        "listings": listings,
        "total_listings": len(listings),
        "member_since": farmer.created_at,
        "bio": farmer.bio or f"{farmer.name} cultiva {farmer.crops} em {farmer.city}, {farmer.state}"
    }

# ========== CHAT / MENSAGENS DIRETAS (DM) ==========

@router.post("/messages/send")
def send_direct_message(
    message: schemas.DirectMessageCreate,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Enviar mensagem direta para outro agricultor
    
    Cria/atualiza conversa automaticamente.
    """
    
    # Verificar se o destinatário existe
    receiver = db.query(models.Farmer).filter(
        models.Farmer.id == message.receiver_id
    ).first()
    
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agricultor não encontrado"
        )
    
    if receiver.id == current_farmer.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não pode enviar mensagem para si mesmo"
        )
    
    # Criar mensagem
    db_message = models.DirectMessage(
        sender_id=current_farmer.id,
        receiver_id=message.receiver_id,
        content=message.content,
        read=False
    )
    
    db.add(db_message)
    
    # Atualizar ou criar conversa
    conversation = db.query(models.Conversation).filter(
        or_(
            and_(models.Conversation.farmer1_id == current_farmer.id, 
                 models.Conversation.farmer2_id == message.receiver_id),
            and_(models.Conversation.farmer1_id == message.receiver_id, 
                 models.Conversation.farmer2_id == current_farmer.id)
        )
    ).first()
    
    if not conversation:
        # Criar nova conversa
        conversation = models.Conversation(
            farmer1_id=current_farmer.id,
            farmer2_id=message.receiver_id,
            last_message_at=datetime.now()
        )
        db.add(conversation)
    else:
        # Atualizar timestamp
        conversation.last_message_at = datetime.now()
    
    db.commit()
    db.refresh(db_message)
    
    return {
        "message": "Mensagem enviada com sucesso",
        "message_id": db_message.id,
        "conversation_id": conversation.id
    }

@router.get("/messages/conversations")
def get_conversations(
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Listar todas as conversas do usuário (lista de chats)
    
    Retorna os agricultores com quem você já conversou,
    com preview da última mensagem.
    """
    
    # Buscar conversas
    conversations = db.query(models.Conversation).filter(
        or_(
            models.Conversation.farmer1_id == current_farmer.id,
            models.Conversation.farmer2_id == current_farmer.id
        )
    ).order_by(models.Conversation.last_message_at.desc()).all()
    
    result = []
    for conv in conversations:
        # Identificar o outro agricultor
        other_farmer_id = conv.farmer2_id if conv.farmer1_id == current_farmer.id else conv.farmer1_id
        other_farmer = db.query(models.Farmer).filter(models.Farmer.id == other_farmer_id).first()
        
        # Última mensagem
        last_msg = db.query(models.DirectMessage).filter(
            or_(
                and_(models.DirectMessage.sender_id == current_farmer.id,
                     models.DirectMessage.receiver_id == other_farmer_id),
                and_(models.DirectMessage.sender_id == other_farmer_id,
                     models.DirectMessage.receiver_id == current_farmer.id)
            )
        ).order_by(models.DirectMessage.created_at.desc()).first()
        
        # Contar não lidas
        unread = db.query(models.DirectMessage).filter(
            models.DirectMessage.sender_id == other_farmer_id,
            models.DirectMessage.receiver_id == current_farmer.id,
            models.DirectMessage.read == False
        ).count()
        
        result.append({
            "conversation_id": conv.id,
            "other_farmer": other_farmer,
            "last_message": last_msg.content if last_msg else None,
            "last_message_at": conv.last_message_at,
            "unread_count": unread
        })
    
    return result

@router.get("/messages/with/{farmer_id}")
def get_messages_with_farmer(
    farmer_id: int,
    skip: int = 0,
    limit: int = 50,
    current_farmer: models.Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db)
):
    """
    Ver mensagens com um agricultor específico (chat individual)
    
    Retorna histórico de mensagens ordenado cronologicamente.
    """
    
    # Buscar mensagens entre os dois agricultores
    messages = db.query(models.DirectMessage).filter(
        or_(
            and_(models.DirectMessage.sender_id == current_farmer.id,
                 models.DirectMessage.receiver_id == farmer_id),
            and_(models.DirectMessage.sender_id == farmer_id,
                 models.DirectMessage.receiver_id == current_farmer.id)
        )
    ).order_by(models.DirectMessage.created_at.asc()).offset(skip).limit(limit).all()
    
    # Marcar como lidas as mensagens recebidas
    db.query(models.DirectMessage).filter(
        models.DirectMessage.sender_id == farmer_id,
        models.DirectMessage.receiver_id == current_farmer.id,
        models.DirectMessage.read == False
    ).update({"read": True})
    db.commit()
    
    # Buscar info do outro agricultor
    other_farmer = db.query(models.Farmer).filter(models.Farmer.id == farmer_id).first()
    
    return {
        "other_farmer": other_farmer,
        "messages": messages,
        "total": len(messages)
    }

# ========== BUSCA AVANÇADA ==========

@router.get("/search")
def search_farmers_and_products(
    query: str,
    filter_type: Optional[str] = None,  # "farmers", "products", "all"
    city: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Busca avançada de agricultores e produtos
    
    Permite buscar por:
    - Nome do agricultor
    - Cidade
    - Produtos/culturas
    - Quantidade específica
    """
    
    results = {
        "farmers": [],
        "products": [],
        "listings": []
    }
    
    if not filter_type or filter_type in ["farmers", "all"]:
        # Buscar agricultores
        farmers_query = db.query(models.Farmer).filter(
            or_(
                models.Farmer.name.ilike(f"%{query}%"),
                models.Farmer.crops.ilike(f"%{query}%"),
                models.Farmer.city.ilike(f"%{query}%")
            )
        )
        
        if city:
            farmers_query = farmers_query.filter(models.Farmer.city.ilike(f"%{city}%"))
        if state:
            farmers_query = farmers_query.filter(models.Farmer.state == state)
        
        results["farmers"] = farmers_query.limit(20).all()
    
    if not filter_type or filter_type in ["products", "all"]:
        # Buscar produtos
        products_query = db.query(models.Product).filter(
            or_(
                models.Product.name.ilike(f"%{query}%"),
                models.Product.category.ilike(f"%{query}%"),
                models.Product.description.ilike(f"%{query}%")
            )
        )
        results["products"] = products_query.limit(20).all()
        
        # Buscar anúncios
        listings_query = db.query(models.Listing).join(models.Product).filter(
            models.Listing.status == "disponível",
            or_(
                models.Product.name.ilike(f"%{query}%"),
                models.Product.category.ilike(f"%{query}%")
            )
        )
        
        if city:
            listings_query = listings_query.filter(models.Listing.city.ilike(f"%{city}%"))
        if state:
            listings_query = listings_query.filter(models.Listing.state == state)
        
        results["listings"] = listings_query.limit(20).all()
    
    return results

