const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hospital',
  password: 'pg1234',
  port: 5433,
})

pool.on('connect', client => {
  client.query("SET search_path TO public");
});

module.exports = pool;