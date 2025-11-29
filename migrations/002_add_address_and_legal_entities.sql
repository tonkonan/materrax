-- Миграция 002: Добавление адресов, юр лиц и базы для проверки надежности

-- Добавляем поля адреса и юр лица в users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS legal_entity_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS legal_entity_inn VARCHAR(20),
ADD COLUMN IF NOT EXISTS legal_entity_ogrn VARCHAR(20),
ADD COLUMN IF NOT EXISTS address_full TEXT,
ADD COLUMN IF NOT EXISTS address_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS address_region VARCHAR(100);

-- Добавляем индекс для быстрого поиска по ИНН
CREATE INDEX IF NOT EXISTS idx_users_inn ON users(legal_entity_inn);

-- Таблица базы юр лиц для проверки надежности
CREATE TABLE IF NOT EXISTS legal_entities_verification (
  id SERIAL PRIMARY KEY,
  inn VARCHAR(20) UNIQUE NOT NULL,
  legal_name VARCHAR(500) NOT NULL,
  ogrn VARCHAR(20),
  status VARCHAR(50) NOT NULL, -- 'active', 'liquidated', 'bankrupt', 'reliable', 'unreliable'
  registration_date DATE,
  liquidation_date DATE,
  reliability_score INTEGER DEFAULT 0, -- 0-100, где 100 - максимально надежный
  violations_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_legal_entities_inn ON legal_entities_verification(inn);
CREATE INDEX IF NOT EXISTS idx_legal_entities_status ON legal_entities_verification(status);
CREATE INDEX IF NOT EXISTS idx_legal_entities_reliability ON legal_entities_verification(reliability_score DESC);

-- Комментарии
COMMENT ON TABLE legal_entities_verification IS 'База юр лиц для проверки надежности перевозчиков';
COMMENT ON COLUMN legal_entities_verification.reliability_score IS 'Оценка надежности 0-100 (100 - максимально надежный)';
COMMENT ON COLUMN legal_entities_verification.violations_count IS 'Количество нарушений/жалоб';

-- Триггер для автообновления updated_at
CREATE TRIGGER update_legal_entities_updated_at
  BEFORE UPDATE ON legal_entities_verification
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



