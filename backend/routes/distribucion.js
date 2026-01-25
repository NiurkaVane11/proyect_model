const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Obtener todas las distribuciones
router.get('/', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        d.*,
        p.nombre_comercial,
        p.ciudad as panaderia_ciudad
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      ORDER BY d.fecha_entrega DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener distribuciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribuciones',
      error: error.message
    });
  }
});

// GET - Obtener una distribución por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query(`
      SELECT 
        d.*,
        p.nombre_comercial,
        p.direccion as panaderia_direccion,
        p.ciudad as panaderia_ciudad,
        p.telefono as panaderia_telefono
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      WHERE d.id_distribucion = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Distribución no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener distribución:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribución',
      error: error.message
    });
  }
});

// GET - Obtener distribuciones por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    const { estado } = req.params;
    const rows = await pool.query(`
      SELECT 
        d.*,
        p.nombre_comercial
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      WHERE d.estado_entrega = ?
      ORDER BY d.fecha_entrega DESC
    `, [estado]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener distribuciones por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribuciones por estado',
      error: error.message
    });
  }
});

// GET - Obtener distribuciones por panadería
router.get('/panaderia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query(`
      SELECT 
        d.*,
        p.nombre_comercial
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      WHERE d.id_panaderia = ?
      ORDER BY d.fecha_entrega DESC
    `, [id]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener distribuciones por panadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribuciones por panadería',
      error: error.message
    });
  }
});

// GET - Obtener distribuciones por rango de fechas
router.get('/fecha/:desde/:hasta', async (req, res) => {
  try {
    const { desde, hasta } = req.params;
    const rows = await pool.query(`
      SELECT 
        d.*,
        p.nombre_comercial
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      WHERE d.fecha_entrega BETWEEN ? AND ?
      ORDER BY d.fecha_entrega DESC
    `, [desde, hasta]);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener distribuciones por fecha:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribuciones por fecha',
      error: error.message
    });
  }
});

// POST - Crear nueva distribución
router.post('/', async (req, res) => {
  try {
    const {
      id_panaderia,
      fecha_entrega,
      cantidad_entregada,
      nombre_receptor,
      cedula_receptor,
      firma_recibido,
      estado_entrega,
      hora_entrega,
      observaciones,
      foto_evidencia,
      latitud,
      longitud,
      usuario_registro
    } = req.body;

    // Validar campos obligatorios
    if (!id_panaderia || !fecha_entrega || !cantidad_entregada) {
      return res.status(400).json({
        success: false,
        message: 'Panadería, fecha de entrega y cantidad son campos obligatorios'
      });
    }

    const result = await pool.query(
      `INSERT INTO distribucion_bolsas (
        id_panaderia, fecha_entrega, cantidad_entregada,
        nombre_receptor, cedula_receptor, firma_recibido,
        estado_entrega, hora_entrega, observaciones,
        foto_evidencia, latitud, longitud, usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_panaderia, fecha_entrega, cantidad_entregada,
        nombre_receptor, cedula_receptor, firma_recibido,
        estado_entrega || 'pendiente', hora_entrega, observaciones,
        foto_evidencia, latitud, longitud, usuario_registro
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Distribución creada exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear distribución:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear distribución',
      error: error.message
    });
  }
});

// PUT - Actualizar distribución
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Verificar que la distribución existe
    const exists = await pool.query(
      'SELECT id_distribucion FROM distribucion_bolsas WHERE id_distribucion = ?',
      [id]
    );
    
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Distribución no encontrada'
      });
    }
    
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), id];
    
    await pool.query(
      `UPDATE distribucion_bolsas SET ${fields} WHERE id_distribucion = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Distribución actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar distribución:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar distribución',
      error: error.message
    });
  }
});

// PATCH - Actualizar estado de entrega
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_entrega } = req.body;
    
    if (!estado_entrega || !['pendiente', 'entregado', 'cancelado'].includes(estado_entrega)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: pendiente, entregado o cancelado'
      });
    }
    
    await pool.query(
      'UPDATE distribucion_bolsas SET estado_entrega = ? WHERE id_distribucion = ?',
      [estado_entrega, id]
    );

    res.json({
      success: true,
      message: 'Estado de entrega actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
});

// DELETE - Eliminar distribución
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la distribución existe
    const exists = await pool.query(
      'SELECT id_distribucion FROM distribucion_bolsas WHERE id_distribucion = ?',
      [id]
    );
    
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Distribución no encontrada'
      });
    }
    
    await pool.query(
      'DELETE FROM distribucion_bolsas WHERE id_distribucion = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Distribución eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar distribución:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar distribución',
      error: error.message
    });
  }
});

// GET - Estadísticas de distribuciones
router.get('/stats/general', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_distribuciones,
        SUM(CASE WHEN estado_entrega = 'entregado' THEN 1 ELSE 0 END) as entregadas,
        SUM(CASE WHEN estado_entrega = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado_entrega = 'cancelado' THEN 1 ELSE 0 END) as canceladas,
        SUM(cantidad_entregada) as total_bolsas_entregadas,
        AVG(cantidad_entregada) as promedio_bolsas_por_entrega,
        COUNT(DISTINCT id_panaderia) as panaderias_atendidas
      FROM distribucion_bolsas
    `);
    
    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// GET - Estadísticas por panadería
router.get('/stats/panaderia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await pool.query(`
      SELECT 
        p.nombre_comercial,
        COUNT(*) as total_entregas,
        SUM(d.cantidad_entregada) as total_bolsas,
        AVG(d.cantidad_entregada) as promedio_bolsas,
        MAX(d.fecha_entrega) as ultima_entrega,
        MIN(d.fecha_entrega) as primera_entrega
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      WHERE d.id_panaderia = ?
      GROUP BY d.id_panaderia
    `, [id]);
    
    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay estadísticas para esta panadería'
      });
    }
    
    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas por panadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas por panadería',
      error: error.message
    });
  }
});

// GET - Distribuciones del día
router.get('/hoy/todas', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        d.*,
        p.nombre_comercial,
        p.direccion as panaderia_direccion
      FROM distribucion_bolsas d
      LEFT JOIN panaderias p ON d.id_panaderia = p.id_panaderia
      WHERE DATE(d.fecha_entrega) = CURDATE()
      ORDER BY d.hora_entrega
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener distribuciones del día:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener distribuciones del día',
      error: error.message
    });
  }
});

module.exports = router;