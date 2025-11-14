-- Script SQL para criar todas as tabelas do TerraViva no Supabase
-- Execute este script no SQL Editor do Supabase (https://supabase.com/dashboard)

-- Tabela de Agricultores (Farmers)
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    crops TEXT,
    budget FLOAT DEFAULT 0.0,
    production_weekly VARCHAR(100),
    surplus VARCHAR(100),
    sale_preference VARCHAR(20) DEFAULT 'direta',
    contact VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Perguntas (Questions)
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id),
    question_text TEXT NOT NULL,
    answer_text TEXT,
    audio_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos (Products)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Anúncios (Listings)
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity_total FLOAT NOT NULL,
    quantity_sold FLOAT DEFAULT 0.0,
    price FLOAT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    status VARCHAR(20) DEFAULT 'disponível',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Cooperativas (Cooperatives)
CREATE TABLE IF NOT EXISTS cooperatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    main_product VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Membros de Cooperativas (Cooperative Memberships)
CREATE TABLE IF NOT EXISTS cooperative_memberships (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES farmers(id),
    cooperative_id INTEGER NOT NULL REFERENCES cooperatives(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Solicitações de Cooperativas
CREATE TABLE IF NOT EXISTS cooperative_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL REFERENCES farmers(id),
    receiver_id INTEGER NOT NULL REFERENCES farmers(id),
    cooperative_id INTEGER REFERENCES cooperatives(id),
    listing_id INTEGER REFERENCES listings(id),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    conversation_id INTEGER REFERENCES conversations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_farmers_email ON farmers(email);
CREATE INDEX IF NOT EXISTS idx_questions_farmer_id ON questions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_farmer_id ON listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON listings(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_cooperative_memberships_farmer ON cooperative_memberships(farmer_id);
CREATE INDEX IF NOT EXISTS idx_cooperative_memberships_coop ON cooperative_memberships(cooperative_id);
CREATE INDEX IF NOT EXISTS idx_cooperative_requests_receiver ON cooperative_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_cooperative_requests_status ON cooperative_requests(status);

-- Comentários nas tabelas
COMMENT ON TABLE farmers IS 'Tabela de agricultores familiares cadastrados na plataforma';
COMMENT ON TABLE questions IS 'Perguntas feitas pelos agricultores à IA consultora';
COMMENT ON TABLE products IS 'Catálogo de produtos disponíveis no marketplace';
COMMENT ON TABLE listings IS 'Anúncios de produtos publicados pelos agricultores';
COMMENT ON TABLE cooperatives IS 'Cooperativas cadastradas na plataforma';
COMMENT ON TABLE cooperative_memberships IS 'Relação entre agricultores e cooperativas';

-- Mensagem de sucesso
SELECT 'Tabelas criadas com sucesso! ✅' AS status;

