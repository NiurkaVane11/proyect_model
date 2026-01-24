const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todas las producciones
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM produccion_bolsas 
       ORDER BY fecha_orden DESC`
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener producciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las producciones',
      error: error.message
    });
  }
});

// GET - Obtener una producción por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM produccion_bolsas WHERE id_produccion = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producción no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener producción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la producción',
      error: error.message
    });
  }
});

// POST - Crear nueva producción
router.post('/', async (req, res) => {
  try {
    const {
      numero_orden,
      fecha_orden,
      proveedor_impresion,
      cantidad_solicitada,
      cantidad_producida,
      cantidad_defectuosa,
      costo_unitario,
      costo_total,
      fecha_estimada_entrega,
      fecha_real_entrega,
      responsable_calidad,
      estado,
      observaciones,
      usuario_registro
    } = req.body;

    // Validaciones básicas
    if (!numero_orden || !fecha_orden || !cantidad_solicitada) {
      return res.status(400).json({
        success: false,
        message: 'Campos obligatorios: numero_orden, fecha_orden, cantidad_solicitada'
      });
    }

    const [result] = await db.query(
      `INSERT INTO produccion_bolsas (
        numero_orden,
        fecha_orden,
        proveedor_impresion,
        cantidad_solicitada,
        cantidad_producida,
        cantidad_defectuosa,
        costo_unitario,
        costo_total,
        fecha_estimada_entrega,
        fecha_real_entrega,
        responsable_calidad,
        estado,
        observaciones,
        usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numero_orden,
        fecha_orden,
        proveedor_impresion || null,
        cantidad_solicitada,
        cantidad_producida || null,
        cantidad_defectuosa || 0,
        costo_unitario || null,
        costo_total || null,
        fecha_estimada_entrega || null,
        fecha_real_entrega || null,
        responsable_calidad || null,
        estado || 'pendiente',
        observaciones || null,
        usuario_registro || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Producción creada exitosamente',
      data: {
        id_produccion: result.insertId
      }
    });
  } catch (error) {
    console.error('Error al crear producción:', error);
    
    // Error de clave duplicada (número de orden ya existe)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'El número de orden ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la producción',
      error: error.message
    });
  }
});

// PUT - Actualizar producción
router.put('/:id', async (req, res) => {
  try {
    const {
      numero_orden,
      fecha_orden,
      proveedor_impresion,
      cantidad_solicitada,
      cantidad_producida,
      cantidad_defectuosa,
      costo_unitario,
      costo_total,
      fecha_estimada_entrega,
      fecha_real_entrega,
      responsable_calidad,
      estado,
      observaciones
    } = req.body;

    // Verificar que la producción existe
    const [existing] = await db.query(
      'SELECT id_produccion FROM produccion_bolsas WHERE id_produccion = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producción no encontrada'
      });
    }

    await db.query(
      `UPDATE produccion_bolsas SET
        numero_orden = ?,
        fecha_orden = ?,
        proveedor_impresion = ?,
        cantidad_solicitada = ?,
        cantidad_producida = ?,
        cantidad_defectuosa = ?,
        costo_unitario = ?,
        costo_total = ?,
        fecha_estimada_entrega = ?,
        fecha_real_entrega = ?,
        responsable_calidad = ?,
        estado = ?,
        observaciones = ?
      WHERE id_produccion = ?`,
      [
        numero_orden,
        fecha_orden,
        proveedor_impresion || null,
        cantidad_solicitada,
        cantidad_producida || null,
        cantidad_defectuosa || 0,
        costo_unitario || null,
        costo_total || null,
        fecha_estimada_entrega || null,
        fecha_real_entrega || null,
        responsable_calidad || null,
        estado || 'pendiente',
        observaciones || null,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: 'Producción actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar producción:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'El número de orden ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la producción',
      error: error.message
    });
  }
});

// DELETE - Eliminar producción
router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await db.query(
      'SELECT id_produccion FROM produccion_bolsas WHERE id_produccion = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producción no encontrada'
      });
    }

    await db.query(
      'DELETE FROM produccion_bolsas WHERE id_produccion = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Producción eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la producción',
      error: error.message
    });
  }
});

// GET - Estadísticas de producción
router.get('/stats/summary', async (req, res) => {
  try {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_ordenes,
        SUM(cantidad_solicitada) as total_solicitado,
        SUM(cantidad_producida) as total_producido,
        SUM(cantidad_defectuosa) as total_defectuoso,
        SUM(costo_total) as costo_total,
        AVG(costo_unitario) as costo_promedio,
        COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes,
        COUNT(CASE WHEN estado = 'en_produccion' THEN 1 END) as en_produccion,
        COUNT(CASE WHEN estado = 'finalizado' THEN 1 END) as finalizados,
        COUNT(CASE WHEN estado = 'entregado' THEN 1 END) as entregados
      FROM produccion_bolsas`
    );

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

// GET - Producciones por estado
router.get('/filter/estado/:estado', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM produccion_bolsas 
       WHERE estado = ?
       ORDER BY fecha_orden DESC`,
      [req.params.estado]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al filtrar por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al filtrar producciones',
      error: error.message
    });
  }
});

// GET - Producciones por rango de fechas
router.get('/filter/fechas', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const [rows] = await db.query(
      `SELECT * FROM produccion_bolsas 
       WHERE fecha_orden BETWEEN ? AND ?
       ORDER BY fecha_orden DESC`,
      [fecha_inicio, fecha_fin]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al filtrar por fechas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al filtrar producciones',
      error: error.message
    });
  }
});

module.exports = router;