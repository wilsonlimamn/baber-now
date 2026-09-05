-- Script SQL para criar banco e tabelas no seu PostgreSQL existente
-- Você pode rodar no seu contêiner:
-- docker exec -i algodoal-postgres psql -U postgres -c "CREATE DATABASE barber_db;"
-- docker exec -i algodoal-postgres psql -U postgres -d barber_db < src/db/schema.sql

CREATE TABLE IF NOT EXISTS barbers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  phone VARCHAR(50),
  experience_years INT DEFAULT 1,
  bio TEXT,
  neighborhoods JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  working_hours JSONB DEFAULT '{"start": "08:00", "end": "20:00"}'::jsonb,
  available_days JSONB DEFAULT '[1,2,3,4,5,6]'::jsonb,
  status VARCHAR(20) DEFAULT 'available',
  city VARCHAR(100) DEFAULT 'São Paulo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(64) PRIMARY KEY,
  barber_id VARCHAR(64) REFERENCES barbers(id) ON DELETE SET NULL,
  barber_name VARCHAR(255),
  barber_phone VARCHAR(50),
  barber_avatar TEXT,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  address JSONB NOT NULL,
  service_id VARCHAR(64),
  service_name VARCHAR(255),
  price NUMERIC(10, 2) NOT NULL,
  duration_min INT DEFAULT 30,
  appointment_date VARCHAR(20) NOT NULL,
  appointment_time VARCHAR(10) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) DEFAULT 'São Paulo'
);
