from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
import backend.models as models, backend.schemas as schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TerraViva API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"TerraViva": "API conectada ao banco!"}

@app.post("/usuarios", response_model=schemas.Usuario)
def criar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    novo = models.UsuarioAgricultor(
        nome_usuario=usuario.nome_usuario,
        email=usuario.email,
        senha_hash=usuario.senha_hash
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@app.get("/usuarios", response_model=list[schemas.Usuario])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.UsuarioAgricultor).all()
