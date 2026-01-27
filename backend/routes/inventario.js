const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Helper function: Convierte cadenas vacías a null para campos numéricos
const parseIntOrNull = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
};

const parseDecimalOrNull = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

// GET - Obtener todo el inventario
router.get('/', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT * FROM inventario 
      ORDER BY tipo_material, descripcion
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario',
      error: error.message
    });
  }
});

// GET - Obtener un item por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query(
      'SELECT * FROM inventario WHERE id_inventario = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener material',
      error: error.message
    });
  }
});

// GET - Obtener materiales por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    const { estado } = req.params;
    const rows = await pool.query(
      'SELECT * FROM inventario WHERE estado = ? ORDER BY tipo_material',
      [estado]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener materiales por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener materiales por estado',
      error: error.message
    });
  }
});

// GET - Obtener materiales con stock bajo
router.get('/filtro/stock-bajo', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT * FROM inventario 
      WHERE cantidad_actual <= cantidad_minima 
      AND cantidad_minima IS NOT NULL
      AND cantidad_minima > 0
      ORDER BY cantidad_actual ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener materiales con stock bajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener materiales con stock bajo',
      error: error.message
    });
  }
});

// GET - Obtener materiales por tipo
router.get('/tipo/:tipo', async (req, res) => {
  try {
    const { tipo } = req.params;
    const rows = await pool.query(
      'SELECT * FROM inventario WHERE tipo_material LIKE ? ORDER BY descripcion',
      [`%${tipo}%`]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener materiales por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener materiales por tipo',
      error: error.message
    });
  }
});

// GET - Obtener materiales por ubicación
router.get('/ubicacion/:ubicacion', async (req, res) => {
  try {
    const { ubicacion } = req.params;
    const rows = await pool.query(
      'SELECT * FROM inventario WHERE ubicacion_almacen LIKE ? ORDER BY tipo_material',
      [`%${ubicacion}%`]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener materiales por ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener materiales por ubicación',
      error: error.message
    });
  }
});

// POST - Crear nuevo material en inventario (CORREGIDO)
router.post('/', async (req, res) => {
  try {
    const {
      tipo_material,
      descripcion,
      unidad_medida,
      cantidad_actual,
      cantidad_minima,
      cantidad_maxima,
      costo_unitario,
      ubicacion_almacen,
      estado,
      usuario_registro
    } = req.body;

    // Validar campos obligatorios
    if (!tipo_material || !descripcion || cantidad_actual === undefined || cantidad_actual === '') {
      return res.status(400).json({
        success: false,
        message: 'Tipo de material, descripción y cantidad actual son campos obligatorios'
      });
    }

    // Convertir valores vacíos a null
    const result = await pool.query(
      `INSERT INTO inventario (
        tipo_material, descripcion, unidad_medida, cantidad_actual,
        cantidad_minima, cantidad_maxima, costo_unitario,
        ubicacion_almacen, estado, usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo_material,
        descripcion,
        unidad_medida || null,
        parseIntOrNull(cantidad_actual),
        parseIntOrNull(cantidad_minima),
        parseIntOrNull(cantidad_maxima),
        parseDecimalOrNull(costo_unitario),
        ubicacion_almacen || null,
        estado || 'disponible',
        usuario_registro || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Material agregado al inventario exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear material',
      error: error.message
    });
  }
});

// PUT - Actualizar material (CORREGIDO)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tipo_material,
      descripcion,
      unidad_medida,
      cantidad_actual,
      cantidad_minima,
      cantidad_maxima,
      costo_unitario,
      ubicacion_almacen,
      estado,
      usuario_registro
    } = req.body;
    
    // Verificar que el material existe
    const exists = await pool.query(
      'SELECT id_inventario FROM inventario WHERE id_inventario = ?',
      [id]
    );
    
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }
    
    // Actualizar con conversión de valores vacíos a null
    await pool.query(
      `UPDATE inventario SET 
        tipo_material = ?,
        descripcion = ?,
        unidad_medida = ?,
        cantidad_actual = ?,
        cantidad_minima = ?,
        cantidad_maxima = ?,
        costo_unitario = ?,
        ubicacion_almacen = ?,
        estado = ?
      WHERE id_inventario = ?`,
      [
        tipo_material,
        descripcion,
        unidad_medida || null,
        parseIntOrNull(cantidad_actual),
        parseIntOrNull(cantidad_minima),
        parseIntOrNull(cantidad_maxima),
        parseDecimalOrNull(costo_unitario),
        ubicacion_almacen || null,
        estado || 'disponible',
        id
      ]
    );

    res.json({
      success: true,
      message: 'Material actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar material',
      error: error.message
    });
  }
});

// PATCH - Actualizar cantidad en inventario
router.patch('/:id/cantidad', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad_actual, operacion } = req.body;
    
    if (!cantidad_actual || !operacion) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere cantidad y tipo de operación (sumar, restar, establecer)'
      });
    }

    let query;
    if (operacion === 'sumar') {
      query = 'UPDATE inventario SET cantidad_actual = cantidad_actual + ? WHERE id_inventario = ?';
    } else if (operacion === 'restar') {
      query = 'UPDATE inventario SET cantidad_actual = GREATEST(cantidad_actual - ?, 0) WHERE id_inventario = ?';
    } else if (operacion === 'establecer') {
      query = 'UPDATE inventario SET cantidad_actual = ? WHERE id_inventario = ?';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Operación inválida. Use: sumar, restar o establecer'
      });
    }

    await pool.query(query, [parseIntOrNull(cantidad_actual), id]);

    res.json({
      success: true,
      message: 'Cantidad actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cantidad',
      error: error.message
    });
  }
});

// PATCH - Actualizar estado del material
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado || !['disponible', 'agotado', 'en_pedido', 'descontinuado'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: disponible, agotado, en_pedido o descontinuado'
      });
    }
    
    await pool.query(
      'UPDATE inventario SET estado = ? WHERE id_inventario = ?',
      [estado, id]
    );

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente'
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

// DELETE - Eliminar material del inventario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el material existe
    const exists = await pool.query(
      'SELECT id_inventario FROM inventario WHERE id_inventario = ?',
      [id]
    );
    
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material no encontrado'
      });
    }
    
    await pool.query(
      'DELETE FROM inventario WHERE id_inventario = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Material eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar material',
      error: error.message
    });
  }
});

// GET - Estadísticas generales del inventario
router.get('/stats/general', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_materiales,
        SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN estado = 'agotado' THEN 1 ELSE 0 END) as agotados,
        SUM(CASE WHEN estado = 'en_pedido' THEN 1 ELSE 0 END) as en_pedido,
        SUM(CASE WHEN cantidad_actual <= cantidad_minima AND cantidad_minima > 0 THEN 1 ELSE 0 END) as stock_bajo,
        SUM(cantidad_actual * COALESCE(costo_unitario, 0)) as valor_total_inventario,
        AVG(costo_unitario) as costo_promedio
      FROM inventario
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

// GET - Estadísticas por tipo de material
router.get('/stats/por-tipo', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        tipo_material,
        COUNT(*) as cantidad_items,
        SUM(cantidad_actual) as cantidad_total,
        SUM(cantidad_actual * COALESCE(costo_unitario, 0)) as valor_total,
        AVG(costo_unitario) as costo_promedio
      FROM inventario
      GROUP BY tipo_material
      ORDER BY valor_total DESC
    `);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas por tipo',
      error: error.message
    });
  }
});

// GET - Reporte de stock bajo
router.get('/reportes/stock-bajo', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        id_inventario,
        tipo_material,
        descripcion,
        cantidad_actual,
        cantidad_minima,
        unidad_medida,
        ubicacion_almacen,
        (cantidad_minima - cantidad_actual) as cantidad_necesaria
      FROM inventario 
      WHERE cantidad_actual <= cantidad_minima 
      AND cantidad_minima IS NOT NULL
      AND cantidad_minima > 0
      ORDER BY (cantidad_minima - cantidad_actual) DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener reporte de stock bajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte de stock bajo',
      error: error.message
    });
  }
});

// GET - Valoración del inventario
router.get('/reportes/valoracion', async (req, res) => {
  try {
    const rows = await pool.query(`
      SELECT 
        tipo_material,
        descripcion,
        cantidad_actual,
        costo_unitario,
        (cantidad_actual * COALESCE(costo_unitario, 0)) as valor_total,
        unidad_medida,
        estado
      FROM inventario 
      WHERE estado = 'disponible'
      ORDER BY valor_total DESC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener valoración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener valoración',
      error: error.message
    });
  }
});

module.exports = router;