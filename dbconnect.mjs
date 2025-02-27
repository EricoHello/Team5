// dbconnect.mjs
import sql from 'mssql';
import { config } from './config.mjs';

export async function connectToDatabase() {
  try {
    let pool = await sql.connect(config);
    console.log('Connected to SQL Server successfully!');
    return pool;
  } catch (err) {
    console.error('Database connection failed: ', err);
  }
}
