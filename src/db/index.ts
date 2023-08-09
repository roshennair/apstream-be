import mysql2 from 'mysql2/promise';

const pool = mysql2.createPool(process.env.DATABASE_URL ?? '');

export default pool;
