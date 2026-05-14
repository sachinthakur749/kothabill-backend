import { Pool } from 'pg';
import logger from './logger';

let pool: Pool;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    pool.on('connect', () => {
      logger.info('Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      logger.error('Unexpected error on PostgreSQL client', err);
    });
  }
  return pool;
}

export async function connectDatabase(): Promise<void> {
  try {
    await getPool().query('SELECT NOW()');
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export { getPool as pool };
export default getPool;