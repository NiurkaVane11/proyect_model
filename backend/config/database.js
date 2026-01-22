const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vane',
  database: process.env.DB_NAME || 'infopan_db',
  port: parseInt(process.env.DB_PORT) || 3306,
  connectionLimit: 10,
  acquireTimeout: 30000,  // 30 segundos para adquirir conexión
  connectTimeout: 10000,   // 10 segundos para conectar
  socketPath: undefined,   // Forzar TCP/IP en lugar de socket
  trace: true             // Para debug
});

// Probar la conexión con mejor manejo de errores
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MariaDB exitosa!');
    const rows = await connection.query('SELECT 1 as val');
    console.log('📊 Prueba de query exitosa:', rows);
    connection.release();
  } catch (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    console.error('Código de error:', err.code);
    console.error('SQL State:', err.sqlState);
  }
})();

module.exports = pool;