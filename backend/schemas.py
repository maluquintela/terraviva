from pydantic import BaseModel

class UsuarioBase(BaseModel):
    nome_usuario: str
    email: str

class UsuarioCreate(UsuarioBase):
    senha_hash: str

class Usuario(UsuarioBase):
    id: int
    class Config:
        orm_mode = True


class PlantacaoBase(BaseModel):
    nome_cultura: str
    tipo_solo: str
    clima: str

class PlantacaoCreate(PlantacaoBase):
    data_plantio: str | None = None
    observacoes: str | None = None
    usuario_id: int

class Plantacao(PlantacaoBase):
    id: int
    usuario_id: int
    class Config:
        orm_mode = True
