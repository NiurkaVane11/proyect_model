const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Obtener todas las panaderías
router.get('/', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM panaderias ORDER BY nombre_comercial');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener panaderías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener panaderías',
      error: error.message
    });
  }
});

// GET - Obtener una panadería por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query(
      'SELECT * FROM panaderias WHERE id_panaderia = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Panadería no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener panadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener panadería',
      error: error.message
    });
  }
});

// GET - Obtener panaderías por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    const { estado } = req.params;
    const rows = await pool.query(
      'SELECT * FROM panaderias WHERE estado = ? ORDER BY nombre_comercial',
      [estado]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener panaderías por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener panaderías por estado',
      error: error.message
    });
  }
});

// GET - Obtener panaderías por ciudad
router.get('/ciudad/:ciudad', async (req, res) => {
  try {
    const { ciudad } = req.params;
    const rows = await pool.query(
      'SELECT * FROM panaderias WHERE ciudad = ? ORDER BY nombre_comercial',
      [ciudad]
    );
    
    res.json({
      success: true,
      data: rows
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

// POST - Crear nueva panadería
router.post('/', async (req, res) => {
  try {
    const {
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
      observaciones
    } = req.body;

    const result = await pool.query(
      `INSERT INTO panaderias (
        nombre_comercial, razon_social, ruc, nombre_contacto,
        cargo_contacto, telefono, celular, email, direccion,
        ciudad, provincia, referencia_ubicacion, cantidad_bolsas_mensual,
        fecha_inicio_servicio, tipo_local, horario_atencion, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_comercial, razon_social, ruc, nombre_contacto,
        cargo_contacto, telefono, celular, email, direccion,
        ciudad, provincia, referencia_ubicacion, cantidad_bolsas_mensual,
        fecha_inicio_servicio, tipo_local, horario_atencion, observaciones
      ]
    );

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
    const updates = req.body;
    
    // Verificar que la panadería existe
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
    
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), id];
    
    await pool.query(
      `UPDATE panaderias SET ${fields} WHERE id_panaderia = ?`,
      values
    );

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

// PATCH - Actualizar estado de la panadería
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado || !['activo', 'inactivo', 'suspendido'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: activo, inactivo o suspendido'
      });
    }
    
    await pool.query(
      'UPDATE panaderias SET estado = ? WHERE id_panaderia = ?',
      [estado, id]
    );

    res.json({
      success: true,
      message: 'Estado de panadería actualizado exitosamente'
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

// DELETE - Eliminar panadería
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la panadería existe
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
    
    await pool.query(
      'DELETE FROM panaderias WHERE id_panaderia = ?',
      [id]
    );

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

// GET - Estadísticas de panaderías
router.get('/stats/general', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_panaderias,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activas,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivas,
        SUM(CASE WHEN estado = 'suspendido' THEN 1 ELSE 0 END) as suspendidas,
        SUM(cantidad_bolsas_mensual) as total_bolsas_mensual,
        AVG(cantidad_bolsas_mensual) as promedio_bolsas_mensual
      FROM panaderias
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

module.exports = router;