const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'infopan_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión exitosa a MariaDB');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MariaDB:', err.message);
  });

module.exports = pool;