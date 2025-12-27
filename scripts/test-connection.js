import dotenv from 'dotenv';
import { query } from '../lib/db.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await query('SELECT COUNT(*) as count FROM teams');
    console.log('✅ Database connection successful!');
    console.log(`✅ Found ${result.rows[0].count} teams in database`);
    
    // Test a few more queries
    const equipmentCount = await query('SELECT COUNT(*) as count FROM equipment');
    const requestsCount = await query('SELECT COUNT(*) as count FROM maintenance_requests');
    
    console.log(`✅ Found ${equipmentCount.rows[0].count} equipment items`);
    console.log(`✅ Found ${requestsCount.rows[0].count} maintenance requests`);
    console.log('\n✅ All database tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();

