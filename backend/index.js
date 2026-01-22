const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const anunciantesRoutes = require('./routes/anunciantes');

// Usar rutas
app.use('/api/anunciantes', anunciantesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 API de InfoPan funcionando correctamente!',
    version: '1.0.0',
    endpoints: {
      anunciantes: '/api/anunciantes'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API endpoints disponibles en http://localhost:${PORT}/api`);
});