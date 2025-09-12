import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a new pool instance. A pool is a set of active database connections
// that can be reused, which is much more efficient than creating a new connection for every query.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// console.log("DB Connected")

export default pool;