require('dotenv').config();
const mariadb = require('mariadb');

async function testConnection() {
  let conn;
  try {
    console.log('=== PRUEBA CON DRIVER MARIADB ===');
    
    const pool = mariadb.createPool({
      host: 'localhost',
      user: 'root',
      password: 'vane',
      database: 'infopan_db',
      port: 3306,
      connectionLimit: 5
    });

    conn = await pool.getConnection();
    console.log('✅ ¡Conexión exitosa con MariaDB!');
    
    // Prueba una query
    const rows = await conn.query('SELECT DATABASE() as db');
    console.log('Base de datos actual:', rows[0].db);
    
    await conn.end();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Código:', error.code);
  } finally {
    if (conn) conn.end();
  }
}

testConnection();