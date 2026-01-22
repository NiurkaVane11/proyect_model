require('dotenv').config();
const mysql = require('mysql2');

console.log('=== PRUEBA DE CONEXIÓN ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Solo para debug
console.log('Longitud password:', process.env.DB_PASSWORD?.length);
console.log('========================\n');

// Prueba 1: Con variables de entorno
console.log('Prueba 1: Usando variables de entorno...');
const connection1 = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection1.connect((err) => {
  if (err) {
    console.error('❌ Falló con variables de entorno:', err.message);
  } else {
    console.log('✅ ¡Éxito con variables de entorno!');
    connection1.end();
  }
});

// Prueba 2: Con valores hardcodeados
console.log('\nPrueba 2: Usando valores directos...');
const connection2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'vane',
  database: 'infopan_db',
  port: 3306
});

connection2.connect((err) => {
  if (err) {
    console.error('❌ Falló con valores directos:', err.message);
  } else {
    console.log('✅ ¡Éxito con valores directos!');
    connection2.end();
  }
});