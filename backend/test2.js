require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('=== PRUEBA ASYNC ===');
    console.log('Intentando conectar...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'vane',
      database: 'infopan_db',
      port: 3306,
      authPlugins: {
        mysql_native_password: () => () => require('mysql2/lib/auth_plugins').mysql_native_password
      }
    });

    console.log('✅ ¡Conexión exitosa con mysql2/promise!');
    
    // Prueba una query
    const [rows] = await connection.execute('SELECT DATABASE() as db');
    console.log('Base de datos actual:', rows[0].db);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Código:', error.code);
    console.error('SQL State:', error.sqlState);
  }
}

testConnection();