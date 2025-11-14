import sys
from pathlib import Path

# Adicionar a raiz do projeto ao PYTHONPATH
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from database import SessionLocal, models
from backend.auth import get_password_hash
from datetime import datetime, timedelta

def seed_cooperatives():
    """Popular banco com cooperativas e convites de teste"""
    db = SessionLocal()
    
    try:
        print("🌱 Iniciando seed de cooperativas...")
        
        # 1. Verificar/criar usuário de teste
        test_user = db.query(models.Farmer).filter(
            models.Farmer.email == "teste.backend@terraviva.com"
        ).first()
        
        if not test_user:
            print("👤 Criando usuário de teste: teste.backend@terraviva.com")
            test_user = models.Farmer(
                name="Usuário Teste Backend",
                email="teste.backend@terraviva.com",
                password_hash=get_password_hash("senha123"),
                region="Nordeste",
                city="Patos",
                state="PB",
                crops="milho, feijão, mandioca",
                budget=500,
                production_weekly="200 kg",
                surplus="50 kg",
                sale_preference="direta",
                contact="(83) 99999-0001",
                bio="Agricultor familiar com produção diversificada em Patos, PB.",
                cooperation_type="longo_prazo",
                sale_target="direta"
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Usuário criado com ID: {test_user.id}")
        else:
            print(f"✅ Usuário já existe com ID: {test_user.id}")
        
        # 2. Criar outros agricultores para as cooperativas
        farmers_data = [
            {
                "name": "Maria Silva",
                "email": "maria.silva@coop.com",
                "city": "Sousa",
                "state": "PB",
                "crops": "milho, feijão",
                "budget": 300,
                "bio": "Produtora de grãos em Sousa, PB."
            },
            {
                "name": "João Santos",
                "email": "joao.santos@coop.com",
                "city": "Cajazeiras",
                "state": "PB",
                "crops": "tomate, pimentão",
                "budget": 400,
                "bio": "Especialista em hortaliças em Cajazeiras, PB."
            },
            {
                "name": "Ana Costa",
                "email": "ana.costa@coop.com",
                "city": "Patos",
                "state": "PB",
                "crops": "alface, rúcula, couve",
                "budget": 250,
                "bio": "Produtora de folhosas em Patos, PB."
            },
            {
                "name": "Pedro Oliveira",
                "email": "pedro.oliveira@coop.com",
                "city": "Campina Grande",
                "state": "PB",
                "crops": "mel, própolis",
                "budget": 600,
                "bio": "Apicultor em Campina Grande, PB."
            },
            {
                "name": "Carla Mendes",
                "email": "carla.mendes@coop.com",
                "city": "Patos",
                "state": "PB",
                "crops": "batata-doce, inhame",
                "budget": 350,
                "bio": "Produtora de tubérculos em Patos, PB."
            }
        ]
        
        farmers = []
        for data in farmers_data:
            existing = db.query(models.Farmer).filter(
                models.Farmer.email == data["email"]
            ).first()
            
            if not existing:
                farmer = models.Farmer(
                    name=data["name"],
                    email=data["email"],
                    password_hash=get_password_hash("senha123"),
                    region="Nordeste",
                    city=data["city"],
                    state=data["state"],
                    crops=data["crops"],
                    budget=data["budget"],
                    sale_preference="direta",
                    bio=data["bio"],
                    cooperation_type="longo_prazo",
                    sale_target="direta"
                )
                db.add(farmer)
                db.commit()
                db.refresh(farmer)
                farmers.append(farmer)
                print(f"✅ Criado agricultor: {farmer.name} (ID: {farmer.id})")
            else:
                farmers.append(existing)
                print(f"✅ Agricultor já existe: {existing.name} (ID: {existing.id})")
        
        # 3. Criar cooperativas
        cooperatives_data = [
            {
                "name": "Cooperativa Grãos do Sertão",
                "main_product": "Milho e Feijão",
                "description": "Cooperativa focada na produção e comercialização de grãos básicos da região."
            },
            {
                "name": "Cooperativa Horta Verde",
                "main_product": "Hortaliças",
                "description": "União de produtores de hortaliças para venda direta ao consumidor."
            },
            {
                "name": "Cooperativa Mel Dourado",
                "main_product": "Mel e Derivados",
                "description": "Apicultores unidos para produção e comercialização de mel de qualidade."
            }
        ]
        
        cooperatives = []
        for data in cooperatives_data:
            existing = db.query(models.Cooperative).filter(
                models.Cooperative.name == data["name"]
            ).first()
            
            if not existing:
                coop = models.Cooperative(
                    name=data["name"],
                    main_product=data["main_product"],
                    description=data["description"]
                )
                db.add(coop)
                db.commit()
                db.refresh(coop)
                cooperatives.append(coop)
                print(f"✅ Criada cooperativa: {coop.name} (ID: {coop.id})")
            else:
                cooperatives.append(existing)
                print(f"✅ Cooperativa já existe: {existing.name} (ID: {existing.id})")
        
        # 4. Adicionar membros às cooperativas
        memberships_config = [
            # Cooperativa 1: Grãos do Sertão
            (cooperatives[0].id, farmers[0].id),  # Maria Silva
            (cooperatives[0].id, farmers[4].id),  # Carla Mendes
            
            # Cooperativa 2: Horta Verde
            (cooperatives[1].id, farmers[1].id),  # João Santos
            (cooperatives[1].id, farmers[2].id),  # Ana Costa
            
            # Cooperativa 3: Mel Dourado
            (cooperatives[2].id, farmers[3].id),  # Pedro Oliveira
        ]
        
        print("\n📋 Adicionando membros às cooperativas...")
        for coop_id, farmer_id in memberships_config:
            existing_membership = db.query(models.CooperativeMembership).filter(
                models.CooperativeMembership.cooperative_id == coop_id,
                models.CooperativeMembership.farmer_id == farmer_id
            ).first()
            
            if not existing_membership:
                membership = models.CooperativeMembership(
                    cooperative_id=coop_id,
                    farmer_id=farmer_id
                )
                db.add(membership)
                db.commit()
                
                farmer = db.query(models.Farmer).get(farmer_id)
                coop = db.query(models.Cooperative).get(coop_id)
                print(f"✅ {farmer.name} → {coop.name}")
        
        # 5. Criar convites de cooperativa para o usuário de teste
        print(f"\n💌 Criando convites para {test_user.name}...")
        
        invitations = [
            {
                "cooperative_id": cooperatives[0].id,
                "requester_id": farmers[0].id,  # Maria Silva convida
                "message": "Olá! Vi que você cultiva milho e feijão. Gostaria de te convidar para nossa cooperativa Grãos do Sertão!",
                "status": "pendente"
            },
            {
                "cooperative_id": cooperatives[1].id,
                "requester_id": farmers[2].id,  # Ana Costa convida
                "message": "Oi! Estamos formando uma cooperativa de horticultores em Patos. Você se interessaria em participar?",
                "status": "pendente"
            },
            {
                "cooperative_id": cooperatives[2].id,
                "requester_id": farmers[3].id,  # Pedro Oliveira convida
                "message": "Bom dia! Nossa cooperativa de apicultores está crescendo. Você trabalha com mel? Seria ótimo ter você conosco!",
                "status": "pendente"
            },
            # Convite já aceito (histórico)
            {
                "cooperative_id": cooperatives[0].id,
                "requester_id": farmers[4].id,  # Carla Mendes
                "message": "Oi! Trabalho com tubérculos e vi seu perfil. Quer participar de nossa cooperativa?",
                "status": "aceita",
                "responded_at": datetime.now() - timedelta(days=5)
            },
        ]
        
        for inv_data in invitations:
            existing = db.query(models.CooperativeRequest).filter(
                models.CooperativeRequest.requester_id == inv_data["requester_id"],
                models.CooperativeRequest.receiver_id == test_user.id,
                models.CooperativeRequest.cooperative_id == inv_data["cooperative_id"]
            ).first()
            
            if not existing:
                request = models.CooperativeRequest(
                    requester_id=inv_data["requester_id"],
                    receiver_id=test_user.id,
                    cooperative_id=inv_data["cooperative_id"],
                    message=inv_data["message"],
                    status=inv_data["status"],
                    responded_at=inv_data.get("responded_at")
                )
                db.add(request)
                db.commit()
                
                requester = db.query(models.Farmer).get(inv_data["requester_id"])
                coop = db.query(models.Cooperative).get(inv_data["cooperative_id"])
                print(f"✅ Convite de {requester.name} ({coop.name}) → {inv_data['status']}")
        
        print("\n✨ Seed de cooperativas concluído com sucesso!")
        print(f"\n📊 Resumo:")
        print(f"   - Usuário de teste: {test_user.email}")
        print(f"   - Total de cooperativas: {len(cooperatives)}")
        print(f"   - Total de agricultores: {len(farmers) + 1}")
        print(f"   - Convites pendentes: 3")
        print(f"   - Convites aceitos: 1")
        
    except Exception as e:
        print(f"❌ Erro ao popular banco: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_cooperatives()

