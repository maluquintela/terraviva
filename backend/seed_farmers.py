"""
Script para popular o banco de dados com 14 agricultores fictícios
com perfis completos para demonstração do MVP
"""
import sys
from pathlib import Path

# Adicionar raiz do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from database import SessionLocal, models
from auth import get_password_hash

# Lista de 14 agricultores fictícios com dados diversos
MOCK_FARMERS = [
    {
        "name": "João Silva",
        "email": "joao.silva@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Campina Grande",
        "state": "PB",
        "crops": "feijão, milho, mandioca",
        "budget": 150.0,
        "production_weekly": "200kg",
        "surplus": "50kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas direta ao consumidor.",
        "bio": "Agricultor familiar de Campina Grande/PB. Cultiva feijão, milho, mandioca. Orçamento mensal: R$150. Prefere Cooperações semanais com foco em Vendas direta ao consumidor."
    },
    {
        "name": "Maria Santos",
        "email": "maria.santos@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "João Pessoa",
        "state": "PB",
        "crops": "alface, tomate, coentro",
        "budget": 300.0,
        "production_weekly": "150kg",
        "surplus": "40kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas à mercados e ao varejo.",
        "bio": "Agricultora familiar de João Pessoa/PB. Cultiva alface, tomate, coentro. Orçamento mensal: R$300. Prefere Cooperações à longo prazo com foco em Vendas à mercados e ao varejo."
    },
    {
        "name": "Pedro Oliveira",
        "email": "pedro.oliveira@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Cajazeiras",
        "state": "PB",
        "crops": "banana, mamão, goiaba",
        "budget": 200.0,
        "production_weekly": "300kg",
        "surplus": "80kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas por meio de canais digitais.",
        "bio": "Agricultor familiar de Cajazeiras/PB. Cultiva banana, mamão, goiaba. Orçamento mensal: R$200. Prefere Cooperações semanais com foco em Vendas por meio de canais digitais."
    },
    {
        "name": "Ana Costa",
        "email": "ana.costa@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Patos",
        "state": "PB",
        "crops": "cenoura, beterraba, cebola",
        "budget": 250.0,
        "production_weekly": "180kg",
        "surplus": "45kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas institucionais.",
        "bio": "Agricultora familiar de Patos/PB. Cultiva cenoura, beterraba, cebola. Orçamento mensal: R$250. Prefere Cooperações à longo prazo com foco em Vendas institucionais."
    },
    {
        "name": "Carlos Mendes",
        "email": "carlos.mendes@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Sousa",
        "state": "PB",
        "crops": "melancia, abóbora, melão",
        "budget": 400.0,
        "production_weekly": "500kg",
        "surplus": "150kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas direta ao consumidor.",
        "bio": "Agricultor familiar de Sousa/PB. Cultiva melancia, abóbora, melão. Orçamento mensal: R$400. Prefere Cooperações semanais com foco em Vendas direta ao consumidor."
    },
    {
        "name": "Fernanda Lima",
        "email": "fernanda.lima@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Guarabira",
        "state": "PB",
        "crops": "laranja, limão, acerola",
        "budget": 180.0,
        "production_weekly": "220kg",
        "surplus": "60kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas à mercados e ao varejo.",
        "bio": "Agricultora familiar de Guarabira/PB. Cultiva laranja, limão, acerola. Orçamento mensal: R$180. Prefere Cooperações à longo prazo com foco em Vendas à mercados e ao varejo."
    },
    {
        "name": "Roberto Alves",
        "email": "roberto.alves@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Monteiro",
        "state": "PB",
        "crops": "amendoim, gergelim, sorgo",
        "budget": 120.0,
        "production_weekly": "100kg",
        "surplus": "25kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas por meio de canais digitais.",
        "bio": "Agricultor familiar de Monteiro/PB. Cultiva amendoim, gergelim, sorgo. Orçamento mensal: R$120. Prefere Cooperações semanais com foco em Vendas por meio de canais digitais."
    },
    {
        "name": "Juliana Rocha",
        "email": "juliana.rocha@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Pombal",
        "state": "PB",
        "crops": "pimentão, jiló, quiabo",
        "budget": 220.0,
        "production_weekly": "160kg",
        "surplus": "40kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas institucionais.",
        "bio": "Agricultora familiar de Pombal/PB. Cultiva pimentão, jiló, quiabo. Orçamento mensal: R$220. Prefere Cooperações à longo prazo com foco em Vendas institucionais."
    },
    {
        "name": "Marcos Ferreira",
        "email": "marcos.ferreira@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Cabedelo",
        "state": "PB",
        "crops": "coco, caju, manga",
        "budget": 350.0,
        "production_weekly": "400kg",
        "surplus": "120kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas direta ao consumidor.",
        "bio": "Agricultor familiar de Cabedelo/PB. Cultiva coco, caju, manga. Orçamento mensal: R$350. Prefere Cooperações semanais com foco em Vendas direta ao consumidor."
    },
    {
        "name": "Sandra Pereira",
        "email": "sandra.pereira@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Itabaiana",
        "state": "PB",
        "crops": "batata-doce, inhame, macaxeira",
        "budget": 190.0,
        "production_weekly": "250kg",
        "surplus": "70kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas à mercados e ao varejo.",
        "bio": "Agricultora familiar de Itabaiana/PB. Cultiva batata-doce, inhame, macaxeira. Orçamento mensal: R$190. Prefere Cooperações à longo prazo com foco em Vendas à mercados e ao varejo."
    },
    {
        "name": "Francisco Barros",
        "email": "francisco.barros@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Princesa Isabel",
        "state": "PB",
        "crops": "algodão, sisal, palma",
        "budget": 100.0,
        "production_weekly": "80kg",
        "surplus": "20kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas por meio de canais digitais.",
        "bio": "Agricultor familiar de Princesa Isabel/PB. Cultiva algodão, sisal, palma. Orçamento mensal: R$100. Prefere Cooperações semanais com foco em Vendas por meio de canais digitais."
    },
    {
        "name": "Luciana Azevedo",
        "email": "luciana.azevedo@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Bananeiras",
        "state": "PB",
        "crops": "café, banana, graviola",
        "budget": 280.0,
        "production_weekly": "350kg",
        "surplus": "90kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas institucionais.",
        "bio": "Agricultora familiar de Bananeiras/PB. Cultiva café, banana, graviola. Orçamento mensal: R$280. Prefere Cooperações à longo prazo com foco em Vendas institucionais."
    },
    {
        "name": "Antônio Rodrigues",
        "email": "antonio.rodrigues@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Areia",
        "state": "PB",
        "crops": "abacaxi, maracujá, cana",
        "budget": 320.0,
        "production_weekly": "450kg",
        "surplus": "130kg",
        "cooperation_type": "Cooperações semanais",
        "sale_target": "Vendas direta ao consumidor.",
        "bio": "Agricultor familiar de Areia/PB. Cultiva abacaxi, maracujá, cana. Orçamento mensal: R$320. Prefere Cooperações semanais com foco em Vendas direta ao consumidor."
    },
    {
        "name": "Beatriz Moreira",
        "email": "beatriz.moreira@terraviva.com",
        "password": "senha123",
        "region": "Nordeste",
        "city": "Santa Rita",
        "state": "PB",
        "crops": "rúcula, espinafre, agrião",
        "budget": 260.0,
        "production_weekly": "120kg",
        "surplus": "35kg",
        "cooperation_type": "Cooperações à longo prazo",
        "sale_target": "Vendas à mercados e ao varejo.",
        "bio": "Agricultora familiar de Santa Rita/PB. Cultiva rúcula, espinafre, agrião. Orçamento mensal: R$260. Prefere Cooperações à longo prazo com foco em Vendas à mercados e ao varejo."
    }
]

def seed_database(force=False):
    """Popula o banco de dados com os 14 agricultores fictícios"""
    db = SessionLocal()
    
    try:
        print("🌱 Iniciando seed do banco de dados...")
        
        # Verificar se já existem agricultores
        existing_count = db.query(models.Farmer).count()
        if existing_count >= 14 and not force:
            print(f"⚠️  Já existem {existing_count} agricultores no banco.")
            print("💡 Use --force para recriar os dados")
            return
        
        if existing_count > 0:
            # Limpar dados existentes
            print("🗑️  Removendo dados antigos...")
            db.query(models.Farmer).delete()
            db.commit()
        
        # Criar os 14 agricultores
        print(f"📝 Criando {len(MOCK_FARMERS)} agricultores fictícios...")
        
        for i, farmer_data in enumerate(MOCK_FARMERS, 1):
            farmer = models.Farmer(
                name=farmer_data["name"],
                email=farmer_data["email"],
                password_hash=get_password_hash(farmer_data["password"]),
                region=farmer_data["region"],
                city=farmer_data["city"],
                state=farmer_data["state"],
                crops=farmer_data["crops"],
                budget=farmer_data["budget"],
                production_weekly=farmer_data["production_weekly"],
                surplus=farmer_data["surplus"],
                cooperation_type=farmer_data.get("cooperation_type", ""),
                sale_target=farmer_data.get("sale_target", ""),
                bio=farmer_data.get("bio", ""),
                diagnostic_profile=True  # Marcar como tendo completado o diagnóstico
            )
            db.add(farmer)
            print(f"  ✓ {i}. {farmer_data['name']} - {farmer_data['city']}/{farmer_data['state']}")
        
        db.commit()
        
        # Verificar resultado
        final_count = db.query(models.Farmer).count()
        print(f"\n✅ Seed concluído com sucesso!")
        print(f"📊 Total de agricultores no banco: {final_count}")
        print("\n💡 Credenciais para login (todos usam senha: senha123):")
        for farmer_data in MOCK_FARMERS[:3]:
            print(f"  - {farmer_data['email']}")
        print("  ... (e outros 11)")
        
    except Exception as e:
        print(f"❌ Erro ao popular banco de dados: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv or "-f" in sys.argv
    seed_database(force=force)

