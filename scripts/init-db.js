import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse connection string to determine SSL requirements
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please create a .env file with DATABASE_URL=your_connection_string');
  process.exit(1);
}

const url = new URL(databaseUrl);
const isSupabase = url.hostname.includes('supabase.co');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isSupabase ? {
    rejectUnauthorized: false
  } : false
});

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Read and execute schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await pool.query(schemaSQL);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

