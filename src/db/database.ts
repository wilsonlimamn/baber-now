import pg from 'pg';
import { INITIAL_NEIGHBORHOODS, INITIAL_BARBERS, INITIAL_USERS } from '../data/initialData.ts';
const { Pool } = pg;

// Connect to existing PostgreSQL or fallback to local in-memory if no DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : null;

if (pool) {
  console.log('🔗 PostgreSQL pool inicializado com DATABASE_URL');
  // Evita que o Node.js encerre com Unhandled error caso o Postgres caia ou rejeite conexão
  pool.on('error', (err) => {
    console.warn('⚠️ Aviso PostgreSQL pool (servidor continua ativo com fallback):', err.message);
  });
} else {
  console.log('ℹ️ DATABASE_URL não definida, o servidor usará persistência em memória/seed');
}

/**
 * Cria tabelas caso ainda não existam no PostgreSQL
 */
export async function initDb() {
  if (!pool) return;

  let client;
  try {
    client = await pool.connect();
  } catch (connErr: any) {
    console.warn('⚠️ Não foi possível conectar ao PostgreSQL (iniciando em modo resiliente):', connErr.message);
    return;
  }

  try {
    await client.query(`
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
        city VARCHAR(100) DEFAULT 'Belém',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(64) PRIMARY KEY,
        barber_id VARCHAR(64) REFERENCES barbers(id) ON DELETE SET NULL,
        barber_name VARCHAR(255),
        barber_phone VARCHAR(50),
        barber_avatar TEXT,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(100),
        client_email VARCHAR(255),
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
        city VARCHAR(100) DEFAULT 'Belém'
      );

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL DEFAULT '123456',
        role VARCHAR(20) NOT NULL,
        phone VARCHAR(50),
        default_neighborhood VARCHAR(100),
        barber_id VARCHAR(64),
        city VARCHAR(100) DEFAULT 'Belém',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Migração de colunas adicionais para appointments
    try {
      await client.query(`
        ALTER TABLE appointments ADD COLUMN IF NOT EXISTS client_email VARCHAR(255);
        ALTER TABLE appointments ALTER COLUMN client_phone DROP NOT NULL;
      `);
    } catch (colErr) {
      console.log('Coluna client_email já verificada ou erro não crítico:', colErr);
    }

    // Migração automática para Belém: caso o banco já tenha registros antigos de São Paulo
    await client.query(`
      UPDATE barbers SET city = 'Belém' WHERE city ILIKE '%paulo%' OR city ILIKE '%atendimento local%' OR city = '' OR city IS NULL;
      UPDATE neighborhoods SET city = 'Belém' WHERE city ILIKE '%paulo%' OR city ILIKE '%atendimento local%' OR city = '' OR city IS NULL;
      DELETE FROM neighborhoods WHERE name IN ('Pinheiros', 'Jardins', 'Vila Madalena', 'Perdizes', 'Itaim Bibi', 'Moema', 'Vila Mariana', 'Brooklin', 'Morumbi', 'Santana', 'Tucuruvi', 'Tatuapé', 'Mooca', 'Anália Franco', 'Centro');
    `);

    // Insere os bairros de Belém caso a tabela esteja vazia ou sem os bairros oficiais
    for (const n of INITIAL_NEIGHBORHOODS) {
      await client.query(
        `INSERT INTO neighborhoods (name, region, city)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET region = EXCLUDED.region, city = EXCLUDED.city`,
        [n.name, n.region, n.city]
      );
    }

    // Se os barbeiros no banco ainda tiverem bairros antigos de SP, atualiza com os de Belém
    for (const b of INITIAL_BARBERS) {
      await client.query(
        `UPDATE barbers SET neighborhoods = $1, city = 'Belém' WHERE id = $2`,
        [JSON.stringify(b.neighborhoods), b.id]
      );
    }

    // Insere os usuários iniciais caso não existam
    for (const u of INITIAL_USERS) {
      await client.query(
        `INSERT INTO users (id, name, email, password, role, phone, default_neighborhood, barber_id, city)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) DO NOTHING`,
        [u.id, u.name, u.email, '123456', u.role, u.phone || null, u.defaultNeighborhood || null, u.barberId || null, u.city || 'Belém']
      );
    }

    console.log('🗄️ Tabelas PostgreSQL verificadas e sincronizadas para Belém-PA com sucesso.');
  } catch (err) {
    console.error('⚠️ Erro ao inicializar tabelas PostgreSQL:', err);
  } finally {
    client.release();
  }
}
