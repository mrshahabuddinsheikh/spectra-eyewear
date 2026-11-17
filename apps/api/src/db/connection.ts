import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema.js';

let dbInstance: any = null;
let poolInstance: mysql.Pool | null = null;
let isConnected = false;

export async function getDb() {
  if (dbInstance) return { db: dbInstance, isRealDb: isConnected };

  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'spectra_eyewear';
  const dbPort = Number(process.env.DB_PORT || 3306);

  try {
    poolInstance = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000,
    });

    // Test connection with a quick ping
    const connection = await poolInstance.getConnection();
    connection.release();

    dbInstance = drizzle(poolInstance, { schema, mode: 'default' });
    isConnected = true;
    console.log(`✅ [Database] Connected to MySQL/MariaDB database "${dbName}" at ${dbHost}:${dbPort}`);
    return { db: dbInstance, isRealDb: true };
  } catch (err: any) {
    console.warn(`⚠️ [Database] MySQL connection failed (${err.code || err.message}).`);
    console.warn('⚡ [Database] Activating high-performance in-memory persistence layer for seamless local execution.');
    isConnected = false;
    return { db: null, isRealDb: false };
  }
}

export function isDbConnected() {
  return isConnected;
}

export async function closeDb() {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    dbInstance = null;
  }
}
