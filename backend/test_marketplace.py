"""
Script para testar se os anúncios do marketplace estão acessíveis
"""
import sys
from pathlib import Path

# Adicionar raiz do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from database import SessionLocal, models

def test_marketplace():
    """Testa os dados do marketplace"""
    db = SessionLocal()
    
    try:
        # Contar agricultores
        farmers_count = db.query(models.Farmer).count()
        print(f"✅ Total de agricultores: {farmers_count}")
        
        # Contar anúncios
        listings_count = db.query(models.Listing).count()
        print(f"✅ Total de anúncios: {listings_count}")
        
        # Contar produtos
        products_count = db.query(models.Product).count()
        print(f"✅ Total de produtos: {products_count}")
        
        # Listar primeiros 5 anúncios com detalhes
        print("\n📋 Primeiros 5 anúncios:")
        listings = db.query(models.Listing).limit(5).all()
        
        for i, listing in enumerate(listings, 1):
            farmer = db.query(models.Farmer).filter(models.Farmer.id == listing.farmer_id).first()
            product = db.query(models.Product).filter(models.Product.id == listing.product_id).first()
            
            print(f"\n{i}. ID: {listing.id}")
            print(f"   Agricultor: {farmer.name if farmer else 'N/A'}")
            print(f"   Cidade: {listing.city}/{listing.state}")
            print(f"   Produto: {product.name if product else 'N/A'}")
            print(f"   Quantidade: {listing.quantity_total} {product.unit if product else 'kg'}")
            print(f"   Preço: R$ {listing.price}")
            print(f"   Status: {listing.status}")
        
        print("\n✅ Dados do marketplace estão acessíveis e prontos para o MVP!")
        
    except Exception as e:
        print(f"❌ Erro ao testar marketplace: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_marketplace()


