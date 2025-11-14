# 🌱 Perfis de Agricultores para MVP

## ✅ Implementação Concluída

Criei **14 perfis fictícios de agricultores** com dados completos para demonstração do MVP do TerraViva.

### 📊 O que foi criado:

1. **14 Agricultores Fictícios**
   - Nomes realistas
   - Localizações diversas (várias cidades da Paraíba)
   - Cultivos variados (frutas, hortaliças, grãos, etc.)
   - Orçamentos mensais diferentes (R$100 a R$400)
   - Produção semanal e excedentes
   - Tipos de cooperação (semanais ou longo prazo)
   - Alvos de venda (consumidor direto, varejo, institucional, digital)
   - Bio gerada automaticamente com base no diagnóstico

2. **25 Anúncios no Marketplace**
   - Cada agricultor tem 1-2 anúncios de produtos
   - Preços realistas por categoria de produto
   - Quantidades disponíveis e vendidas
   - Status "disponível"

3. **46 Produtos Cadastrados**
   - Frutas: banana, mamão, goiaba, laranja, limão, acerola, coco, caju, manga, abacaxi, maracujá, graviola
   - Hortaliças: alface, tomate, coentro, cenoura, beterraba, cebola, pimentão, jiló, quiabo, rúcula, espinafre, agrião
   - Grãos: feijão, milho, amendoim, gergelim, sorgo, café
   - Raízes: mandioca, batata-doce, inhame, macaxeira
   - Cucurbitáceas: melancia, abóbora, melão
   - Outros: algodão, sisal, palma, cana

### 🎯 Como Usar no MVP:

1. **Visualizar Perfis:**
   - Acesse a página "Mercado"
   - Clique em "Ver perfil para saber mais" em qualquer agricultor
   - Você verá um perfil completo com foto, bio, produtos, localização

2. **Características dos Perfis:**
   - Avatar gerado automaticamente com iniciais
   - Nome completo e localização
   - Bio descrevendo atividade e interesses comerciais
   - Lista de produtos disponíveis
   - Status de produção e estoque
   - Opções para contato e cooperativa

3. **Exemplos de Agricultores:**
   - **João Silva** (Campina Grande/PB): feijão, milho, mandioca
   - **Maria Santos** (João Pessoa/PB): alface, tomate, coentro
   - **Pedro Oliveira** (Cajazeiras/PB): banana, mamão, goiaba
   - **Ana Costa** (Patos/PB): cenoura, beterraba, cebola
   - **Carlos Mendes** (Sousa/PB): melancia, abóbora, melão
   - ... e mais 9 perfis!

### 📁 Arquivos Criados:

- `backend/seed_farmers.py` - Script para popular agricultores
- `backend/seed_listings.py` - Script para criar anúncios

### 🚀 Como Reexecutar os Scripts:

```bash
# Recriar agricultores (apaga e recria)
cd backend
source venv/bin/activate
python seed_farmers.py --force

# Recriar anúncios (apaga e recria)
python seed_listings.py --force
```

### ✨ Resultado:

Agora você pode demonstrar o MVP com **14 agricultores reais** (fictícios mas com dados completos) na página de Mercado. Cada perfil tem:
- ✅ Nome e localização
- ✅ Bio personalizada
- ✅ Produtos com preços e estoque
- ✅ Interface completa de perfil
- ✅ Opções de contato e cooperação

**Observação:** Todos os agricultores usam a senha `senha123` para login de demonstração.

## 🎨 Próximos Passos:

Para tornar o MVP ainda mais realista, você pode:
1. Adicionar fotos reais aos perfis (substituir avatares automáticos)
2. Expandir as bios com mais detalhes
3. Adicionar avaliações/reviews
4. Implementar sistema de favoritos funcional
5. Integrar com rede social (feed de conexões)


