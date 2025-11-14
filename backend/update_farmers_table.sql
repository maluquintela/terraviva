-- Script SQL para adicionar os novos campos à tabela farmers
-- Execute este script no SQL Editor do Supabase

-- Adicionar campo bio (biografia gerada automaticamente)
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Adicionar campo cooperation_type (tipo de cooperação preferida)
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS cooperation_type VARCHAR(20);

-- Adicionar campo sale_target (para quem deseja vender)
ALTER TABLE farmers
ADD COLUMN IF NOT EXISTS sale_target VARCHAR(20);

-- Remover coluna sale_preference antiga (se necessário)
-- ALTER TABLE farmers DROP COLUMN IF EXISTS sale_preference;

-- Atualizar registros existentes com valores padrão
UPDATE farmers
SET 
    bio = COALESCE(bio, ''),
    cooperation_type = COALESCE(cooperation_type, ''),
    sale_target = COALESCE(sale_target, '')
WHERE bio IS NULL OR cooperation_type IS NULL OR sale_target IS NULL;

-- Adicionar comentários nas novas colunas
COMMENT ON COLUMN farmers.bio IS 'Biografia do agricultor gerada automaticamente com base nas preferências';
COMMENT ON COLUMN farmers.cooperation_type IS 'Tipo de cooperação preferida: semanal ou longo_prazo';
COMMENT ON COLUMN farmers.sale_target IS 'Para quem deseja vender: direta, mercados, institucional ou digital';

-- Mensagem de sucesso
SELECT 'Tabela farmers atualizada com sucesso! ✅' AS status;

