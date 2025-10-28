from pydantic import BaseModel
from typing import Optional, List
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

class Farmer(FarmerBase):
    id: int
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
    created_at: datetime

    class Config:
        from_attributes = True

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
