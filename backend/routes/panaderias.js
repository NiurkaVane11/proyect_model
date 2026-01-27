// panaderias.js - Rutas para gestionar las panaderías
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Función helper para formatear fechas - MEJORADA
const formatDateForDB = (date) => {
  // Retorna null si la fecha está vacía, es null, undefined o string vacío
  if (!date || date === '' || date === 'null' || date === 'undefined') {
    return null;
  }
  
  try {
    const d = new Date(date);
    // Verifica si es una fecha válida
    if (isNaN(d.getTime())) {
      return null;
    }
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  } catch (error) {
    return null;
  }
};

/* ======================================================
   1. RUTAS ESTÁTICAS Y VISTAS (SIEMPRE PRIMERO)
====================================================== */

// GET - Panaderías agrupadas por ciudad (VISTA)
router.get('/vistas/por-ciudad', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_panaderias_por_ciudad');
    
    const dataConvertida = rows.map(row => ({
      ...row,
      total_panaderias: Number(row.total_panaderias),
      activas: Number(row.activas || 0),
      inactivas: Number(row.inactivas || 0),
      total_bolsas: Number(row.total_bolsas || 0)
    }));

    res.json({
      success: true,
      data: dataConvertida
    });
  } catch (error) {
    console.error('Error al obtener panaderías por ciudad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panaderías por ciudad',
      error: error.message 
    });
  }
});

// GET - Panaderías de alto consumo (VISTA)
router.get('/vistas/alto-consumo', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_panaderias_alto_consumo');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías de alto consumo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panaderías de alto consumo',
      error: error.message 
    });
  }
});

// GET - Estadísticas generales
router.get('/stats/general', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        COUNT(*) AS total_panaderias,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS activas,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivas,
        SUM(CASE WHEN estado = 'suspendido' THEN 1 ELSE 0 END) AS suspendidas,
        SUM(cantidad_bolsas_mensual) AS total_bolsas_mensual,
        AVG(cantidad_bolsas_mensual) AS promedio_bolsas_mensual
      FROM panaderias
    `);
    
    const stats = rows[0];
    const statsConvertidas = {
      total_panaderias: Number(stats.total_panaderias || 0),
      activas: Number(stats.activas || 0),
      inactivas: Number(stats.inactivas || 0),
      suspendidas: Number(stats.suspendidas || 0),
      total_bolsas_mensual: Number(stats.total_bolsas_mensual || 0),
      promedio_bolsas_mensual: Number(stats.promedio_bolsas_mensual || 0)
    };
    
    res.json({ success: true, data: statsConvertidas });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
});

// GET - Vista estadísticas agrupadas
router.get('/vistas/stats', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_estadisticas_panaderias');
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener estadísticas desde vista:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
});

// GET - Panaderías activas
router.get('/activas', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_panaderias_activas');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías activas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panaderías activas',
      error: error.message 
    });
  }
});

// GET - Obtener todas las panaderías
router.get('/', async (req, res) => {
  try {
    const rows = await pool.query(
      'SELECT * FROM panaderias ORDER BY nombre_comercial'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panaderías',
      error: error.message 
    });
  }
});

/* ======================================================
   2. RUTAS CON PARÁMETROS DINÁMICOS
====================================================== */

// GET - Panaderías por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    const { estado } = req.params;
    const rows = await pool.query(
      'SELECT * FROM panaderias WHERE estado = ? ORDER BY nombre_comercial',
      [estado]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías por estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panaderías por estado',
      error: error.message 
    });
  }
});

// GET - Panaderías por ciudad específica
router.get('/ciudad/:ciudad', async (req, res) => {
  try {
    const { ciudad } = req.params;
    const rows = await pool.query(
      'SELECT * FROM panaderias WHERE ciudad = ? ORDER BY nombre_comercial',
      [ciudad]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías por ciudad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panaderías por ciudad',
      error: error.message 
    });
  }
});

// GET - Obtener panadería por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM panaderias WHERE id_panaderia = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Panadería no encontrada' 
      });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener panadería:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener panadería',
      error: error.message 
    });
  }
});

/* ======================================================
   3. RUTAS DE ESCRITURA (POST, PUT, PATCH, DELETE)
====================================================== */

// POST - Crear nueva panadería
router.post('/', async (req, res) => {
  try {
    // Formatear fecha correctamente
    const fecha_inicio = formatDateForDB(req.body.fecha_inicio_servicio);

    const query = `
      INSERT INTO panaderias (
        nombre_comercial,
        razon_social,
        ruc,
        nombre_contacto,
        cargo_contacto,
        telefono,
        celular,
        email,
        direccion,
        ciudad,
        provincia,
        referencia_ubicacion,
        cantidad_bolsas_mensual,
        fecha_inicio_servicio,
        tipo_local,
        horario_atencion,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.nombre_comercial || '',
      req.body.razon_social || null,
      req.body.ruc || null,
      req.body.nombre_contacto || '',
      req.body.cargo_contacto || null,
      req.body.telefono || '',
      req.body.celular || null,
      req.body.email || null,
      req.body.direccion || '',
      req.body.ciudad || '',
      req.body.provincia || '',
      req.body.referencia_ubicacion || null,
      req.body.cantidad_bolsas_mensual || null,
      fecha_inicio, // Ahora será null si está vacía o inválida
      req.body.tipo_local || null,
      req.body.horario_atencion || null,
      req.body.estado || 'activo'
    ];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Panadería creada exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear panadería:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear panadería',
      error: error.message 
    });
  }
});

// PUT - Actualizar panadería
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const exists = await pool.query(
      'SELECT id_panaderia FROM panaderias WHERE id_panaderia = ?', 
      [id]
    );

    if (exists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Panadería no encontrada' 
      });
    }

    // Formatear fecha correctamente
    const fecha_inicio = formatDateForDB(req.body.fecha_inicio_servicio);

    const query = `
      UPDATE panaderias SET
        nombre_comercial = ?,
        razon_social = ?,
        ruc = ?,
        nombre_contacto = ?,
        cargo_contacto = ?,
        telefono = ?,
        celular = ?,
        email = ?,
        direccion = ?,
        ciudad = ?,
        provincia = ?,
        referencia_ubicacion = ?,
        cantidad_bolsas_mensual = ?,
        fecha_inicio_servicio = ?,
        tipo_local = ?,
        horario_atencion = ?,
        estado = ?
      WHERE id_panaderia = ?
    `;

    const values = [
      req.body.nombre_comercial || '',
      req.body.razon_social || null,
      req.body.ruc || null,
      req.body.nombre_contacto || '',
      req.body.cargo_contacto || null,
      req.body.telefono || '',
      req.body.celular || null,
      req.body.email || null,
      req.body.direccion || '',
      req.body.ciudad || '',
      req.body.provincia || '',
      req.body.referencia_ubicacion || null,
      req.body.cantidad_bolsas_mensual || null,
      fecha_inicio, // Ahora será null si está vacía o inválida
      req.body.tipo_local || null,
      req.body.horario_atencion || null,
      req.body.estado || 'activo',
      id
    ];

    await pool.query(query, values);
    
    res.json({ 
      success: true, 
      message: 'Panadería actualizada exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar panadería:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar panadería',
      error: error.message 
    });
  }
});

// PATCH - Cambiar estado
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['activo', 'inactivo', 'suspendido'].includes(estado)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido. Debe ser: activo, inactivo o suspendido' 
      });
    }

    await pool.query('UPDATE panaderias SET estado = ? WHERE id_panaderia = ?', [estado, id]);
    res.json({ 
      success: true, 
      message: 'Estado actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar estado',
      error: error.message 
    });
  }
});

// DELETE - Eliminar panadería
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const exists = await pool.query('SELECT id_panaderia FROM panaderias WHERE id_panaderia = ?', [id]);
    
    if (exists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Panadería no encontrada' 
      });
    }
    
    await pool.query('DELETE FROM panaderias WHERE id_panaderia = ?', [id]);
    res.json({ 
      success: true, 
      message: 'Panadería eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar panadería:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar panadería',
      error: error.message 
    });
  }
});

module.exports = router;