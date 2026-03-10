const { Pool } = require('pg');

const pool = new Pool({
  user:     process.env.DB_USER     || 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  database: process.env.DB_NAME     || 'hospital',
  password: process.env.DB_PASSWORD || 'pg1234',
  port:     parseInt(process.env.DB_PORT) || 5432,
});

pool.on('connect', client => {
  client.query("SET search_path TO public");
});

module.exports = pool;