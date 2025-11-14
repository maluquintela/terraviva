from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

# Schemas para Farmers (Agricultores)
class FarmerBase(BaseModel):
    name: str
    email: str
    region: str
    city: str
    state: str
    crops: str
    budget: float = 0.0
    production_weekly: Optional[str] = None
    surplus: Optional[str] = None
    sale_preference: str = "direta"
    contact: Optional[str] = None

class FarmerCreate(FarmerBase):
    password: str

class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    crops: Optional[str] = None
    budget: Optional[float] = None
    production_weekly: Optional[str] = None
    surplus: Optional[str] = None
    sale_preference: Optional[str] = None
    contact: Optional[str] = None

class DiagnosticRequest(BaseModel):
    """Schema para diagnóstico inicial do agricultor"""
    city: str
    state: str
    crops: str
    budget: float = 0.0
    production_weekly: Optional[str] = None
    surplus: Optional[str] = None
    sale_preference: str = "direta"
    contact: Optional[str] = None

class DiagnosticResponse(BaseModel):
    """Schema para resposta do diagnóstico"""
    farmer_id: int
    bio: str
    diagnostic_profile: str
    message: str

class Farmer(FarmerBase):
    id: int
    bio: Optional[str] = None
    diagnostic_profile: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schemas para autenticação
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    farmer_id: Optional[int] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# Schemas para Questions (Consultoria IA)
class QuestionBase(BaseModel):
    question_text: str

class QuestionCreate(QuestionBase):
    farmer_id: int

class Question(QuestionBase):
    id: int
    farmer_id: int
    answer_text: Optional[str] = None
    audio_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    question: Question
    answer_text: str
    audio_url: Optional[str] = None

# Schemas para Products (Produtos)
class ProductBase(BaseModel):
    name: str
    category: str
    unit: str
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    price: Optional[float] = None
    quantity: Optional[float] = None
    image_url: Optional[str] = None
    farmer_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ProductCreateWithFarmer(ProductBase):
    """Schema para criar produto com agricultor"""
    price: Optional[float] = None
    quantity: Optional[float] = None
    image_url: Optional[str] = None

# Schemas para Listings (Anúncios)
class ListingBase(BaseModel):
    quantity_total: float
    price: float
    city: str
    state: str

class ListingCreate(ListingBase):
    farmer_id: int
    product_id: int

class ListingUpdate(BaseModel):
    quantity_total: Optional[float] = None
    quantity_sold: Optional[float] = None
    price: Optional[float] = None
    status: Optional[str] = None

class Listing(ListingBase):
    id: int
    farmer_id: int
    product_id: int
    quantity_sold: float = 0.0
    status: str = "disponível"
    published_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ListingWithDetails(Listing):
    farmer: Farmer
    product: Product

# Schemas para Cooperatives (Cooperativas)
class CooperativeBase(BaseModel):
    name: str
    main_product: Optional[str] = None
    description: Optional[str] = None

class CooperativeCreate(CooperativeBase):
    pass

class Cooperative(CooperativeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CooperativeWithMembers(Cooperative):
    members: List[Farmer]

# Schemas para CooperativeMembership
class CooperativeMembershipCreate(BaseModel):
    farmer_id: int
    cooperative_id: int

class CooperativeMembership(BaseModel):
    id: int
    farmer_id: int
    cooperative_id: int
    joined_at: datetime

    class Config:
        from_attributes = True

class CooperativeRequestBase(BaseModel):
    message: Optional[str] = None
    cooperative_id: Optional[int] = None
    listing_id: Optional[int] = None

class CooperativeRequestCreate(CooperativeRequestBase):
    receiver_id: int

class CooperativeRequest(CooperativeRequestBase):
    id: int
    requester_id: int
    receiver_id: int
    status: str
    conversation_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CooperativeRequestDetail(CooperativeRequest):
    requester: Farmer
    receiver: Farmer
    cooperative: Optional[Cooperative] = None
    listing: Optional[ListingWithDetails] = None

class CooperativeRequestResponse(BaseModel):
    action: Literal["accept", "decline"]

# Schemas para IA Consultiva
class AIDiagnoseRequest(BaseModel):
    """Schema para diagnóstico via IA"""
    question: str
    farmer_id: int

class AIDiagnoseResponse(BaseModel):
    """Schema para resposta do diagnóstico IA"""
    response: str
    confidence: float = 0.0

class AIRecommendationResponse(BaseModel):
    """Schema para recomendações da IA"""
    recommendations: List[str]
    based_on: str

# Schemas para Marketplace Social
class MarketplaceFeedItem(BaseModel):
    """Schema para item do feed do marketplace"""
    product: Optional[Product] = None
    listing: Optional[Listing] = None
    farmer: Farmer
    type: str  # "product" ou "listing"

class FollowRequest(BaseModel):
    """Schema para seguir agricultor"""
    farmer_id_to_follow: int

class FollowersResponse(BaseModel):
    """Schema para lista de seguidores"""
    followers: List[Farmer]
    following: List[Farmer]
    total_followers: int
    total_following: int

# Schemas para sugestões de cooperativas
class CooperativeSuggestion(BaseModel):
    """Schema para sugestão de cooperativa"""
    farmer: Farmer
    compatibility_score: float
    reasons: List[str]

# Schemas para Posts de Cooperativas (Rede Social)
class CooperativePostBase(BaseModel):
    """Schema base para posts de cooperativas"""
    content: str
    image_url: Optional[str] = None

class CooperativePostCreate(CooperativePostBase):
    """Schema para criar post em cooperativa"""
    cooperative_id: int

class CooperativePost(CooperativePostBase):
    """Schema para post de cooperativa"""
    id: int
    cooperative_id: int
    farmer_id: int
    likes_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CooperativePostWithDetails(CooperativePost):
    """Schema para post com detalhes do autor"""
    farmer: Farmer
    comments_count: int = 0

# Schemas para Comentários em Posts
class PostCommentBase(BaseModel):
    """Schema base para comentários"""
    content: str

class PostCommentCreate(PostCommentBase):
    """Schema para criar comentário"""
    post_id: int

class PostComment(PostCommentBase):
    """Schema para comentário"""
    id: int
    post_id: int
    farmer_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PostCommentWithAuthor(PostComment):
    """Schema para comentário com autor"""
    farmer: Farmer

# Schemas para Likes em Posts
class PostLikeCreate(BaseModel):
    """Schema para criar like em post"""
    post_id: int

class PostLike(BaseModel):
    """Schema para like"""
    id: int
    post_id: int
    farmer_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Schemas para Mensagens Diretas (Chat/DM)
class DirectMessageCreate(BaseModel):
    """Schema para enviar mensagem"""
    receiver_id: int
    content: str

class DirectMessage(BaseModel):
    """Schema para mensagem"""
    id: int
    sender_id: int
    receiver_id: int
    content: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class DirectMessageWithFarmer(DirectMessage):
    """Schema para mensagem com dados do remetente"""
    sender: Farmer
    receiver: Farmer

class ConversationSummary(BaseModel):
    """Schema para resumo de conversa"""
    conversation_id: int
    other_farmer: Farmer
    last_message: Optional[str] = None
    last_message_at: datetime
    unread_count: int = 0

# Schemas para Feed/Recomendações (tipo Tinder)
class FarmerRecommendation(BaseModel):
    """Schema para recomendação de produtor no feed"""
    farmer: Farmer
    compatibility_score: float  # 0-100
    distance_km: Optional[float] = None
    shared_products: List[str] = []
    complementary_products: List[str] = []
    reasons: List[str] = []  # Motivos da recomendação

class FeedItem(BaseModel):
    """Schema para item do feed tipo Tinder"""
    farmer: Farmer
    match_score: float
    distance: str
    products_in_common: List[str]
    can_complement: List[str]
    highlight: str  # Frase de destaque tipo "80% compatível!"
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0

# Schemas para Feed de Recomendações (tipo Tinder)
class FarmerMatch(BaseModel):
    """Schema para match de produtor no feed"""
    farmer: Farmer
    match_score: float  # 0-100
    distance_km: Optional[float] = None
    compatibility_reasons: List[str]  # Por que deu match
    complementary_products: List[str]  # Produtos que complementam
    surplus_match: bool  # Se tem excedente que o outro precisa

