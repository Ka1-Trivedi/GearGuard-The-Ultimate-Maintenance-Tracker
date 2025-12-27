import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

// Default DATABASE_URL from user's request
const defaultDatabaseUrl = 'postgresql://postgres:HQG6aBRowpqiqLWW@db.dugfpzbvttcqnkmuecxc.supabase.co:5432/postgres';

if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  const envContent = `DATABASE_URL=${defaultDatabaseUrl}
VITE_API_URL=http://localhost:3001/api
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('⚠️  .env file already exists. Skipping creation.');
}

if (!fs.existsSync(envExamplePath)) {
  console.log('Creating .env.example file...');
  const envExampleContent = `DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
VITE_API_URL=http://localhost:3001/api
`;
  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('✅ .env.example file created successfully!');
}

console.log('\n📝 Next steps:');
console.log('1. Review the .env file and update DATABASE_URL if needed');
console.log('2. Run: npm run init-db (to initialize the database)');
console.log('3. Run: npm run dev:all (to start both servers)');

