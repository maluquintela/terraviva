from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UsuarioAgricultor(Base):
    __tablename__ = "usuarios_agricultores"

    id = Column(Integer, primary_key=True, index=True)
    nome_usuario = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    senha_hash = Column(String, nullable=False)

    plantacoes = relationship("Plantacao", back_populates="usuario")

class Plantacao(Base):
    __tablename__ = "plantacoes"

    id = Column(Integer, primary_key=True, index=True)
    nome_cultura = Column(String, nullable=False)
    tipo_solo = Column(String, nullable=False)
    clima = Column(String, nullable=False)
    data_plantio = Column(String)
    observacoes = Column(String)
    usuario_id = Column(Integer, ForeignKey("usuarios_agricultores.id"))

    usuario = relationship("UsuarioAgricultor", back_populates="plantacoes")
