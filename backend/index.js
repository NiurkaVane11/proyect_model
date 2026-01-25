BigInt.prototype.toJSON = function() { return Number(this.toString()) };

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar la conexión a la base de datos
require('./config/database');

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🎉 API de InfoPan funcionando correctamente!',
    version: '1.0.0',
    endpoints: {
      anunciantes: '/api/anunciantes',
      panaderias: '/api/panaderias',
      franquiciados: '/api/franquiciados',
      cobros: '/api/cobros' ,
      produccion: '/api/produccion',
      facturacion: '/api/facturacion',
      distribucion: '/api/distribucion',
      inventario: '/api/inventario',
      pagos: '/api/pagos'
    }
  });
});

// Ruta /api
app.get('/api', (req, res) => {
  res.json({
    message: '📊 API InfoPan - Endpoints disponibles',
    version: '1.0.0',
    endpoints: {
      anunciantes: '/api/anunciantes',
      panaderias: '/api/panaderias',
      franquiciados: '/api/franquiciados',
      cobros: '/api/cobros',
      produccion: '/api/produccion',
      facturacion: '/api/facturacion',
      distribucion: '/api/distribucion',
      inventario: '/api/inventario',
      pagos: '/api/pagos'

    }
  });
});

// Importar rutas
const anunciantesRoutes = require('./routes/anunciantes');
const panaderiasRoutes = require('./routes/panaderias');
const franquiciadosRoutes = require('./routes/franquiciados');  // AGREGADO
const cobrosRoutes = require('./routes/cobros'); 
const produccionRoutes = require('./routes/produccion');
const facturacionRoutes = require('./routes/facturacion');
const distribucionRoutes = require('./routes/distribucion');
const inventarioRoutes = require('./routes/inventario');
const pagosRoutes = require('./routes/pagos');

// Usar rutas
app.use('/api/anunciantes', anunciantesRoutes);
app.use('/api/panaderias', panaderiasRoutes);
app.use('/api/franquiciados', franquiciadosRoutes);  // AGREGADO
app.use('/api/cobros', cobrosRoutes); // Ruta de cobros
app.use('/api/produccion', produccionRoutes);
app.use('/api/facturacion', facturacionRoutes);
app.use('/api/distribucion', distribucionRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/pagos', pagosRoutes);


// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API endpoints disponibles en http://localhost:${PORT}/api`);
});