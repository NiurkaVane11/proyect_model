// panaderias.js - Rutas para gestionar las panaderías
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/* ======================================================
   1. RUTAS ESTÁTICAS Y VISTAS (SIEMPRE PRIMERO)
   Se colocan aquí para que no sean capturadas por /:id
====================================================== */
// GET - Panaderías agrupadas por ciudad (VISTA)
router.get('/vistas/por-ciudad', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_panaderias_por_ciudad');
    
    // Convertimos los BigInt a Numbers normales antes de enviar el JSON
    const dataConvertida = rows.map(row => ({
      ...row,
      total_panaderias: Number(row.total_panaderias) 
    }));

    res.json({
      success: true,
      data: dataConvertida
    });
  } catch (error) {
    console.error('Error al obtener panaderías por ciudad:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});




// GET - Panaderías de alto consumo (VISTA)
router.get('/vistas/alto-consumo', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_panaderias_alto_consumo');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías de alto consumo:', error);
    res.status(500).json({ success: false, message: 'Error al obtener panaderías de alto consumo' });
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
    res.status(500).json({ success: false, message: 'Error al obtener panaderías' });
  }
});

// GET - Panaderías activas
router.get('/activas', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_panaderias_activas');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener panaderías activas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener panaderías activas' });
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
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
});

// GET - Vista estadísticas agrupadas
router.get('/vistas/stats', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_estadisticas_panaderias');
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener estadísticas desde vista:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
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
    res.status(500).json({ success: false, message: 'Error al obtener panaderías por estado' });
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
    res.status(500).json({ success: false, message: 'Error al obtener panaderías por ciudad' });
  }
});

// GET - Obtener panadería por ID (ESTA DEBE IR AL FINAL DE LOS GET)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query('SELECT * FROM panaderias WHERE id_panaderia = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Panadería no encontrada' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener panadería:', error);
    res.status(500).json({ success: false, message: 'Error al obtener panadería' });
  }
});

/* ======================================================
   3. RUTAS DE ESCRITURA (POST, PUT, PATCH, DELETE)
====================================================== */

// POST - Crear nueva panadería
router.post('/', async (req, res) => {
  try {
    const result = await pool.query(`INSERT INTO panaderias SET ?`, [req.body]);
    res.status(201).json({
      success: true,
      message: 'Panadería creada exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear panadería:', error);
    res.status(500).json({ success: false, message: 'Error al crear panadería' });
  }
});

// PUT - Actualizar panadería
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await pool.query('SELECT id_panaderia FROM panaderias WHERE id_panaderia = ?', [id]);

    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: 'Panadería no encontrada' });
    }

    await pool.query('UPDATE panaderias SET ? WHERE id_panaderia = ?', [req.body, id]);
    res.json({ success: true, message: 'Panadería actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar panadería:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar panadería' });
  }
});





// PATCH - Cambiar estado
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['activo', 'inactivo', 'suspendido'].includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    await pool.query('UPDATE panaderias SET estado = ? WHERE id_panaderia = ?', [estado, id]);
    res.json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al cambiar estado' });
  }
});

// DELETE - Eliminar panadería
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM panaderias WHERE id_panaderia = ?', [id]);
    res.json({ success: true, message: 'Panadería eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar panadería:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar panadería' });
  }
});

module.exports = router;