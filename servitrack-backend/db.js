require('dotenv').config();

const { Pool } = require('pg');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query('SELECT NOW()')
  .then((result) => {
    console.log('✅ Connected to PostgreSQL:', result.rows[0]);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

module.exports = pool;