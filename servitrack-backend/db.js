// db.js
// Creates one shared connection pool to PostgreSQL.
// Every route file imports this instead of creating its own connection.

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Optional: log a one-time confirmation that the pool can reach the database.
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL database:', process.env.DB_NAME))
  .catch((err) => console.error('Database connection failed:', err.message));

module.exports = pool;
