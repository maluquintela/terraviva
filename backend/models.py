from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    questions = relationship("Question", back_populates="farmer")
    listings = relationship("Listing", back_populates="farmer")
    cooperative_memberships = relationship("CooperativeMembership", back_populates="farmer")

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamentos
    listings = relationship("Listing", back_populates="product")

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
