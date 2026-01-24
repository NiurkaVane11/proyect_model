const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todos los cobros
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cobros ORDER BY fecha_cobro DESC, fecha_registro DESC'
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener cobros:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los cobros',
      error: error.message
    });
  }
});

// GET - Obtener un cobro por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cobros WHERE id_cobro = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cobro no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener cobro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el cobro',
      error: error.message
    });
  }
});

// GET - Obtener cobros por factura
router.get('/factura/:id_factura', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cobros WHERE id_factura = ? ORDER BY fecha_cobro DESC',
      [req.params.id_factura]
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener cobros de la factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los cobros de la factura',
      error: error.message
    });
  }
});

// POST - Crear un nuevo cobro
router.post('/', async (req, res) => {
  try {
    const {
      id_factura,
      numero_recibo,
      fecha_cobro,
      monto_cobrado,
      metodo_pago,
      numero_comprobante,
      banco,
      numero_cuenta,
      observaciones,
      archivo_comprobante,
      usuario_registro
    } = req.body;

    // Validaciones básicas
    if (!id_factura || !fecha_cobro || !monto_cobrado || !metodo_pago) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    // Validar que el monto sea positivo
    if (parseFloat(monto_cobrado) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto cobrado debe ser mayor a 0'
      });
    }

    // Verificar que la factura existe
    const [factura] = await db.query(
      'SELECT id_factura FROM facturacion WHERE id_factura = ?',
      [id_factura]
    );

    if (factura.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'La factura especificada no existe'
      });
    }

    // Verificar si ya existe el número de recibo (si se proporcionó)
    if (numero_recibo) {
      const [existing] = await db.query(
        'SELECT id_cobro FROM cobros WHERE numero_recibo = ?',
        [numero_recibo]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un cobro con este número de recibo'
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO cobros (
        id_factura, numero_recibo, fecha_cobro, monto_cobrado,
        metodo_pago, numero_comprobante, banco, numero_cuenta,
        observaciones, archivo_comprobante, usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_factura,
        numero_recibo || null,
        fecha_cobro,
        monto_cobrado,
        metodo_pago,
        numero_comprobante || null,
        banco || null,
        numero_cuenta || null,
        observaciones || null,
        archivo_comprobante || null,
        usuario_registro || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Cobro creado exitosamente',
      data: {
        id_cobro: result.insertId
      }
    });
  } catch (error) {
    console.error('Error al crear cobro:', error);
    
    // Manejar errores de duplicados
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cobro con este número de recibo'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear el cobro',
      error: error.message
    });
  }
});

// PUT - Actualizar un cobro
router.put('/:id', async (req, res) => {
  try {
    const {
      id_factura,
      numero_recibo,
      fecha_cobro,
      monto_cobrado,
      metodo_pago,
      numero_comprobante,
      banco,
      numero_cuenta,
      observaciones,
      archivo_comprobante
    } = req.body;

    // Validaciones básicas
    if (!id_factura || !fecha_cobro || !monto_cobrado || !metodo_pago) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    // Validar que el monto sea positivo
    if (parseFloat(monto_cobrado) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto cobrado debe ser mayor a 0'
      });
    }

    // Verificar si el cobro existe
    const [existing] = await db.query(
      'SELECT id_cobro FROM cobros WHERE id_cobro = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cobro no encontrado'
      });
    }

    // Verificar que la factura existe
    const [factura] = await db.query(
      'SELECT id_factura FROM facturacion WHERE id_factura = ?',
      [id_factura]
    );

    if (factura.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'La factura especificada no existe'
      });
    }

    // Verificar si el número de recibo ya existe en otro cobro
    if (numero_recibo) {
      const [duplicateRecibo] = await db.query(
        'SELECT id_cobro FROM cobros WHERE numero_recibo = ? AND id_cobro != ?',
        [numero_recibo, req.params.id]
      );

      if (duplicateRecibo.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro cobro con este número de recibo'
        });
      }
    }

    await db.query(
      `UPDATE cobros SET
        id_factura = ?,
        numero_recibo = ?,
        fecha_cobro = ?,
        monto_cobrado = ?,
        metodo_pago = ?,
        numero_comprobante = ?,
        banco = ?,
        numero_cuenta = ?,
        observaciones = ?,
        archivo_comprobante = ?
      WHERE id_cobro = ?`,
      [
        id_factura,
        numero_recibo || null,
        fecha_cobro,
        monto_cobrado,
        metodo_pago,
        numero_comprobante || null,
        banco || null,
        numero_cuenta || null,
        observaciones || null,
        archivo_comprobante || null,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: 'Cobro actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar cobro:', error);
    
    // Manejar errores de duplicados
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cobro con este número de recibo'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el cobro',
      error: error.message
    });
  }
});

// DELETE - Eliminar un cobro
router.delete('/:id', async (req, res) => {
  try {
    // Verificar si el cobro existe
    const [existing] = await db.query(
      'SELECT id_cobro FROM cobros WHERE id_cobro = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cobro no encontrado'
      });
    }

    await db.query(
      'DELETE FROM cobros WHERE id_cobro = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Cobro eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar cobro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el cobro',
      error: error.message
    });
  }
});

// GET - Obtener estadísticas de cobros
router.get('/stats/resumen', async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_cobros,
        SUM(monto_cobrado) as total_cobrado,
        AVG(monto_cobrado) as promedio_cobro,
        SUM(CASE WHEN metodo_pago = 'efectivo' THEN monto_cobrado ELSE 0 END) as total_efectivo,
        SUM(CASE WHEN metodo_pago = 'transferencia' THEN monto_cobrado ELSE 0 END) as total_transferencia,
        SUM(CASE WHEN metodo_pago = 'cheque' THEN monto_cobrado ELSE 0 END) as total_cheque,
        SUM(CASE WHEN DATE(fecha_cobro) = CURDATE() THEN monto_cobrado ELSE 0 END) as total_hoy,
        COUNT(CASE WHEN DATE(fecha_cobro) = CURDATE() THEN 1 END) as cobros_hoy
      FROM cobros
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

// GET - Obtener cobros por método de pago
router.get('/stats/por-metodo', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        metodo_pago,
        COUNT(*) as cantidad,
        SUM(monto_cobrado) as total
      FROM cobros
      GROUP BY metodo_pago
      ORDER BY total DESC
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas por método:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas por método',
      error: error.message
    });
  }
});

// GET - Obtener cobros por rango de fechas
router.get('/stats/por-fecha', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const [rows] = await db.query(
      `SELECT * FROM cobros 
       WHERE fecha_cobro BETWEEN ? AND ?
       ORDER BY fecha_cobro DESC`,
      [fecha_inicio, fecha_fin]
    );

    const [totales] = await db.query(
      `SELECT 
        COUNT(*) as total_cobros,
        SUM(monto_cobrado) as total_cobrado
       FROM cobros 
       WHERE fecha_cobro BETWEEN ? AND ?`,
      [fecha_inicio, fecha_fin]
    );

    res.json({
      success: true,
      data: {
        cobros: rows,
        resumen: totales[0]
      }
    });
  } catch (error) {
    console.error('Error al obtener cobros por fecha:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cobros por fecha',
      error: error.message
    });
  }
});

module.exports = router;