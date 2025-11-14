"""
Script para criar anúncios (listings) no marketplace para os 14 agricultores
"""
import sys
from pathlib import Path

# Adicionar raiz do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from database import SessionLocal, models
import random

# Preços por categoria de produto (em R$)
PRICES = {
    "feijão": 8.50,
    "milho": 6.00,
    "mandioca": 3.50,
    "alface": 2.50,
    "tomate": 4.00,
    "coentro": 1.50,
    "banana": 3.00,
    "mamão": 4.50,
    "goiaba": 5.00,
    "cenoura": 3.80,
    "beterraba": 4.20,
    "cebola": 3.50,
    "melancia": 2.00,
    "abóbora": 2.50,
    "melão": 4.00,
    "laranja": 3.00,
    "limão": 4.00,
    "acerola": 8.00,
    "amendoim": 12.00,
    "gergelim": 15.00,
    "sorgo": 5.00,
    "pimentão": 5.50,
    "jiló": 4.50,
    "quiabo": 5.00,
    "coco": 3.50,
    "caju": 6.00,
    "manga": 4.00,
    "batata-doce": 3.00,
    "inhame": 4.50,
    "macaxeira": 3.50,
    "algodão": 10.00,
    "sisal": 8.00,
    "palma": 2.00,
    "café": 25.00,
    "graviola": 8.00,
    "abacaxi": 5.00,
    "maracujá": 7.00,
    "cana": 2.50,
    "rúcula": 3.00,
    "espinafre": 3.50,
    "agrião": 3.00,
}

def seed_listings(force=False):
    """Cria anúncios no marketplace para cada agricultor"""
    db = SessionLocal()
    
    try:
        print("🛒 Iniciando seed de anúncios do marketplace...")
        
        # Buscar todos os agricultores
        farmers = db.query(models.Farmer).all()
        
        if not farmers:
            print("❌ Nenhum agricultor encontrado. Execute primeiro seed_farmers.py")
            return
        
        # Verificar se já existem anúncios
        existing_count = db.query(models.Listing).count()
        if existing_count > 0 and not force:
            print(f"⚠️  Já existem {existing_count} anúncios no banco.")
            print("💡 Use --force para recriar os dados")
            return
        
        if existing_count > 0:
            # Limpar dados existentes
            print("🗑️  Removendo anúncios antigos...")
            db.query(models.Listing).delete()
            db.commit()
        
        # Criar produtos (se não existirem)
        existing_products = {p.name: p for p in db.query(models.Product).all()}
        
        print("📦 Criando produtos...")
        for product_name, price in PRICES.items():
            if product_name not in existing_products:
                product = models.Product(
                    name=product_name,
                    category="hortifruti" if product_name in ["alface", "tomate", "cenoura"] else "grãos e frutas",
                    unit="kg",
                    description=f"Produto de qualidade: {product_name}"
                )
                db.add(product)
                existing_products[product_name] = product
        
        db.commit()
        print(f"  ✓ {len(existing_products)} produtos cadastrados")
        
        # Criar anúncios para cada agricultor
        print(f"\n📝 Criando anúncios para {len(farmers)} agricultores...")
        
        listings_created = 0
        for farmer in farmers:
            # Cada agricultor cria 1-2 anúncios dos seus produtos
            if not farmer.crops:
                continue
            crops = [c.strip() for c in farmer.crops.split(",") if c.strip()]
            
            for crop in crops[:2]:  # Máximo 2 anúncios por agricultor
                # Buscar produto correspondente
                product = existing_products.get(crop)
                if not product:
                    # Criar produto se não existir
                    product = models.Product(
                        name=crop,
                        category="diversos",
                        unit="kg",
                        description=f"Produto: {crop}"
                    )
                    db.add(product)
                    db.flush()
                    existing_products[crop] = product
                
                # Calcular quantidade baseada no excedente
                try:
                    surplus_kg = int(''.join(filter(str.isdigit, farmer.surplus or "50")))
                except:
                    surplus_kg = 50
                
                quantity_total = surplus_kg * random.uniform(0.5, 1.5)
                quantity_sold = quantity_total * random.uniform(0, 0.3)  # 0-30% vendido
                
                # Preço baseado no produto
                price = PRICES.get(crop, 5.00)
                
                # Criar anúncio
                listing = models.Listing(
                    farmer_id=farmer.id,
                    product_id=product.id,
                    quantity_total=round(quantity_total, 2),
                    quantity_sold=round(quantity_sold, 2),
                    price=price,
                    city=farmer.city,
                    state=farmer.state,
                    status="disponível"
                )
                db.add(listing)
                listings_created += 1
            
            print(f"  ✓ {farmer.name} - {len(crops[:2])} anúncios")
        
        db.commit()
        
        # Verificar resultado
        final_count = db.query(models.Listing).count()
        print(f"\n✅ Seed de anúncios concluído com sucesso!")
        print(f"📊 Total de anúncios criados: {final_count}")
        print(f"📦 Total de produtos cadastrados: {len(existing_products)}")
        
    except Exception as e:
        print(f"❌ Erro ao criar anúncios: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv or "-f" in sys.argv
    seed_listings(force=force)

