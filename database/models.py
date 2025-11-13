from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Tabela associativa para seguir agricultores (funcionalidade social)
farmer_followers = Table(
    "farmer_followers",
    Base.metadata,
    Column("follower_id", Integer, ForeignKey("farmers.id"), primary_key=True),
    Column("followed_id", Integer, ForeignKey("farmers.id"), primary_key=True),
)

class Farmer(Base):
    """Modelo para agricultores familiares"""
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    region = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(2), nullable=False)
    crops = Column(Text)  # Lista de culturas separadas por vírgula
    budget = Column(Float, default=0.0)
    production_weekly = Column(String(100))
    surplus = Column(String(100))
    sale_preference = Column(String(20), default="direta")  # direta, institucional, digital
    contact = Column(String(20))
    bio = Column(Text)  # Biografia gerada automaticamente
    diagnostic_profile = Column(Text)  # Perfil de diagnóstico em JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    questions = relationship("Question", back_populates="farmer")
    listings = relationship("Listing", back_populates="farmer")
    cooperative_memberships = relationship("CooperativeMembership", back_populates="farmer")
    products = relationship("Product", back_populates="farmer")
    
    # Relacionamentos sociais (seguir/seguidores) - será definido após a classe
    
    def update_bio(self):
        """Gera biografia automaticamente baseada nos dados do agricultor"""
        parts = []
        
        if self.name:
            parts.append(f"{self.name}")
        
        if self.crops:
            crops_list = self.crops.split(",") if "," in self.crops else [self.crops]
            crops_str = " e ".join([c.strip() for c in crops_list[:2]])
            if len(crops_list) > 2:
                crops_str += f" e outras culturas"
            parts.append(f"cultiva {crops_str}")
        
        if self.city and self.state:
            parts.append(f"em {self.city}, {self.state}")
        
        if self.sale_preference:
            preference_map = {
                "direta": "prefere vender diretamente ao consumidor",
                "institucional": "prefere vender para instituições",
                "digital": "prefere vender através de plataformas digitais"
            }
            parts.append(f"{preference_map.get(self.sale_preference, 'vende produtos')}")
        
        if self.budget and self.budget > 0:
            parts.append(f"possui orçamento médio de R$ {self.budget:.2f} mensais")
        
        self.bio = ". ".join(parts) + "." if parts else None
        return self.bio

class Question(Base):
    """Modelo para perguntas dos agricultores à IA"""
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text)
    audio_path = Column(String(255))  # Caminho para o arquivo de áudio
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    farmer = relationship("Farmer", back_populates="questions")

class Product(Base):
    """Modelo para produtos do marketplace"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # hortaliça, fruta, mel, etc.
    unit = Column(String(20), nullable=False)  # kg, unidade, caixa
    description = Column(Text)
    price = Column(Float)  # Preço unitário
    quantity = Column(Float)  # Quantidade disponível
    image_url = Column(String(255))  # URL da imagem
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)  # Produtor direto (opcional)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    listings = relationship("Listing", back_populates="product")
    farmer = relationship("Farmer", back_populates="products")

class Listing(Base):
    """Modelo para anúncios no marketplace"""
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity_total = Column(Float, nullable=False)
    quantity_sold = Column(Float, default=0.0)
    price = Column(Float, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(2), nullable=False)
    status = Column(String(20), default="disponível")  # disponível, vendido
    published_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    farmer = relationship("Farmer", back_populates="listings")
    product = relationship("Product", back_populates="listings")

class Cooperative(Base):
    """Modelo para cooperativas"""
    __tablename__ = "cooperatives"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    main_product = Column(String(100))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    memberships = relationship("CooperativeMembership", back_populates="cooperative")

class CooperativeMembership(Base):
    """Tabela associativa para membros de cooperativas"""
    __tablename__ = "cooperative_memberships"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    cooperative_id = Column(Integer, ForeignKey("cooperatives.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    farmer = relationship("Farmer", back_populates="cooperative_memberships")
    cooperative = relationship("Cooperative", back_populates="memberships")

class CooperativePost(Base):
    """Modelo para posts/publicações em cooperativas"""
    __tablename__ = "cooperative_posts"

    id = Column(Integer, primary_key=True, index=True)
    cooperative_id = Column(Integer, ForeignKey("cooperatives.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255))  # URL da imagem (opcional)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    cooperative = relationship("Cooperative")
    farmer = relationship("Farmer")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")

class PostComment(Base):
    """Modelo para comentários em posts de cooperativas"""
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("cooperative_posts.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    post = relationship("CooperativePost", back_populates="comments")
    farmer = relationship("Farmer")

class PostLike(Base):
    """Modelo para curtidas em posts de cooperativas"""
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("cooperative_posts.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    post = relationship("CooperativePost", back_populates="likes")
    farmer = relationship("Farmer")

class DirectMessage(Base):
    """Modelo para mensagens diretas entre agricultores"""
    __tablename__ = "direct_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    content = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    sender = relationship("Farmer", foreign_keys=[sender_id])
    receiver = relationship("Farmer", foreign_keys=[receiver_id])

class Conversation(Base):
    """Modelo para conversas entre agricultores (agrupa mensagens)"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    farmer1_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    farmer2_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    last_message_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    farmer1 = relationship("Farmer", foreign_keys=[farmer1_id])
    farmer2 = relationship("Farmer", foreign_keys=[farmer2_id])

# Configurar relacionamento many-to-many após definição das classes
Farmer.following = relationship(
    "Farmer",
    secondary=farmer_followers,
    primaryjoin="farmer_followers.c.follower_id == Farmer.id",
    secondaryjoin="farmer_followers.c.followed_id == Farmer.id",
    backref="followers"
)

