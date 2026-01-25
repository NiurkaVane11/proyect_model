const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todas las facturas
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM facturacion ORDER BY fecha_emision DESC, fecha_registro DESC'
    );
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    });
  }
});

// GET - Obtener una factura por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM facturacion WHERE id_factura = ?',
      [req.params.id]
    );
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la factura',
      error: error.message
    });
  }
});

// GET - Obtener facturas por anunciante
router.get('/anunciante/:id_anunciante', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM facturacion WHERE id_anunciante = ? ORDER BY fecha_emision DESC',
      [req.params.id_anunciante]
    );
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener facturas del anunciante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas del anunciante',
      error: error.message
    });
  }
});

// POST - Crear una nueva factura
router.post('/', async (req, res) => {
  try {
    const {
      id_anunciante,
      numero_factura,
      numero_autorizacion_sri,
      clave_acceso,
      fecha_emision,
      fecha_vencimiento,
      subtotal,
      porcentaje_iva,
      valor_iva,
      total,
      concepto,
      cantidad_fundas,
      precio_unitario,
      periodo_servicio,
      estado_factura,
      monto_pagado,
      saldo_pendiente,
      archivo_xml,
      archivo_pdf,
      observaciones,
      usuario_registro
    } = req.body;

    if (!id_anunciante || !numero_factura || !fecha_emision || !fecha_vencimiento || !subtotal || !concepto) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    if (parseFloat(subtotal) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El subtotal debe ser mayor a 0'
      });
    }

    const resultAnunciante = await db.query(
      'SELECT id_anunciante FROM anunciantes WHERE id_anunciante = ?',
      [id_anunciante]
    );
    const anunciante = Array.isArray(resultAnunciante[0]) ? resultAnunciante[0] : resultAnunciante;

    if (anunciante.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El anunciante especificado no existe'
      });
    }

    const resultExisting = await db.query(
      'SELECT id_factura FROM facturacion WHERE numero_factura = ?',
      [numero_factura]
    );
    const existing = Array.isArray(resultExisting[0]) ? resultExisting[0] : resultExisting;

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una factura con este número'
      });
    }

    const iva = porcentaje_iva || 15.00;
    const calculatedValorIva = valor_iva || (parseFloat(subtotal) * parseFloat(iva) / 100).toFixed(2);
    const calculatedTotal = total || (parseFloat(subtotal) + parseFloat(calculatedValorIva)).toFixed(2);
    const calculatedSaldo = saldo_pendiente || (parseFloat(calculatedTotal) - parseFloat(monto_pagado || 0)).toFixed(2);

    const result = await db.query(
      `INSERT INTO facturacion (
        id_anunciante, numero_factura, numero_autorizacion_sri, clave_acceso,
        fecha_emision, fecha_vencimiento, subtotal, porcentaje_iva, valor_iva,
        total, concepto, cantidad_fundas, precio_unitario, periodo_servicio,
        estado_factura, monto_pagado, saldo_pendiente, archivo_xml, archivo_pdf,
        observaciones, usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_anunciante, numero_factura, numero_autorizacion_sri || null, clave_acceso || null,
        fecha_emision, fecha_vencimiento, subtotal, iva, calculatedValorIva,
        calculatedTotal, concepto, cantidad_fundas || null, precio_unitario || null, periodo_servicio || null,
        estado_factura || 'emitida', monto_pagado || 0.00, calculatedSaldo, archivo_xml || null, archivo_pdf || null,
        observaciones || null, usuario_registro || null
      ]
    );

    const insertId = result.insertId || result[0]?.insertId;

    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: { id_factura: insertId }
    });
  } catch (error) {
    console.error('Error al crear factura:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una factura con este número'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la factura',
      error: error.message
    });
  }
});

// PUT - Actualizar una factura
router.put('/:id', async (req, res) => {
  try {
    const {
      id_anunciante, numero_factura, numero_autorizacion_sri, clave_acceso,
      fecha_emision, fecha_vencimiento, subtotal, porcentaje_iva, valor_iva,
      total, concepto, cantidad_fundas, precio_unitario, periodo_servicio,
      estado_factura, monto_pagado, saldo_pendiente, archivo_xml, archivo_pdf,
      observaciones, motivo_anulacion, fecha_anulacion
    } = req.body;

    if (!id_anunciante || !numero_factura || !fecha_emision || !fecha_vencimiento || !subtotal || !concepto) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    if (parseFloat(subtotal) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El subtotal debe ser mayor a 0'
      });
    }

    const resultExisting = await db.query(
      'SELECT id_factura FROM facturacion WHERE id_factura = ?',
      [req.params.id]
    );
    const existing = Array.isArray(resultExisting[0]) ? resultExisting[0] : resultExisting;

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }

    const iva = porcentaje_iva || 15.00;
    const calculatedValorIva = valor_iva || (parseFloat(subtotal) * parseFloat(iva) / 100).toFixed(2);
    const calculatedTotal = total || (parseFloat(subtotal) + parseFloat(calculatedValorIva)).toFixed(2);
    const calculatedSaldo = saldo_pendiente || (parseFloat(calculatedTotal) - parseFloat(monto_pagado || 0)).toFixed(2);

    await db.query(
      `UPDATE facturacion SET
        id_anunciante = ?, numero_factura = ?, numero_autorizacion_sri = ?, clave_acceso = ?,
        fecha_emision = ?, fecha_vencimiento = ?, subtotal = ?, porcentaje_iva = ?, valor_iva = ?,
        total = ?, concepto = ?, cantidad_fundas = ?, precio_unitario = ?, periodo_servicio = ?,
        estado_factura = ?, monto_pagado = ?, saldo_pendiente = ?, archivo_xml = ?, archivo_pdf = ?,
        observaciones = ?, motivo_anulacion = ?, fecha_anulacion = ?
      WHERE id_factura = ?`,
      [
        id_anunciante, numero_factura, numero_autorizacion_sri || null, clave_acceso || null,
        fecha_emision, fecha_vencimiento, subtotal, iva, calculatedValorIva,
        calculatedTotal, concepto, cantidad_fundas || null, precio_unitario || null, periodo_servicio || null,
        estado_factura || 'emitida', monto_pagado || 0.00, calculatedSaldo, archivo_xml || null, archivo_pdf || null,
        observaciones || null, motivo_anulacion || null, fecha_anulacion || null, req.params.id
      ]
    );

    res.json({
      success: true,
      message: 'Factura actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la factura',
      error: error.message
    });
  }
});

// DELETE - Eliminar una factura
router.delete('/:id', async (req, res) => {
  try {
    const resultExisting = await db.query(
      'SELECT id_factura FROM facturacion WHERE id_factura = ?',
      [req.params.id]
    );
    const existing = Array.isArray(resultExisting[0]) ? resultExisting[0] : resultExisting;

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }

    const resultCobros = await db.query(
      'SELECT id_cobro FROM cobros WHERE id_factura = ?',
      [req.params.id]
    );
    const cobros = Array.isArray(resultCobros[0]) ? resultCobros[0] : resultCobros;

    if (cobros.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la factura porque tiene cobros asociados'
      });
    }

    await db.query(
      'DELETE FROM facturacion WHERE id_factura = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Factura eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la factura',
      error: error.message
    });
  }
});

// GET - Obtener estadísticas de facturación
router.get('/stats/resumen', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_facturas,
        SUM(total) as total_facturado,
        SUM(monto_pagado) as total_pagado,
        SUM(saldo_pendiente) as total_pendiente,
        AVG(total) as promedio_factura,
        SUM(CASE WHEN estado_factura = 'emitida' THEN 1 ELSE 0 END) as facturas_emitidas,
        SUM(CASE WHEN estado_factura = 'pagada' THEN 1 ELSE 0 END) as facturas_pagadas,
        SUM(CASE WHEN estado_factura = 'pagada_parcial' THEN 1 ELSE 0 END) as facturas_parciales,
        SUM(CASE WHEN estado_factura = 'vencida' THEN 1 ELSE 0 END) as facturas_vencidas,
        SUM(CASE WHEN estado_factura = 'anulada' THEN 1 ELSE 0 END) as facturas_anuladas
      FROM facturacion
    `);

    const rows = Array.isArray(result) ? (Array.isArray(result[0]) ? result[0] : result) : [result];
    const stats = rows[0] || {};

    res.json({
      success: true,
      data: stats
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

// GET - Obtener facturas por estado
router.get('/stats/por-estado', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        estado_factura,
        COUNT(*) as cantidad,
        SUM(total) as total,
        SUM(saldo_pendiente) as saldo_pendiente
      FROM facturacion
      GROUP BY estado_factura
      ORDER BY cantidad DESC
    `);
    
    const rows = Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas por estado',
      error: error.message
    });
  }
});

// GET - Obtener facturas por rango de fechas
router.get('/stats/por-fecha', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren fecha_inicio y fecha_fin'
      });
    }

    const resultRows = await db.query(
      `SELECT * FROM facturacion 
       WHERE fecha_emision BETWEEN ? AND ?
       ORDER BY fecha_emision DESC`,
      [fecha_inicio, fecha_fin]
    );

    const resultTotales = await db.query(
      `SELECT 
        COUNT(*) as total_facturas,
        SUM(total) as total_facturado,
        SUM(monto_pagado) as total_pagado,
        SUM(saldo_pendiente) as total_pendiente
       FROM facturacion 
       WHERE fecha_emision BETWEEN ? AND ?`,
      [fecha_inicio, fecha_fin]
    );

    const rows = Array.isArray(resultRows[0]) ? resultRows[0] : resultRows;
    const totalesArr = Array.isArray(resultTotales) ? (Array.isArray(resultTotales[0]) ? resultTotales[0] : resultTotales) : [resultTotales];

    res.json({
      success: true,
      data: {
        facturas: rows,
        resumen: totalesArr[0] || {}
      }
    });
  } catch (error) {
    console.error('Error al obtener facturas por fecha:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener facturas por fecha',
      error: error.message
    });
  }
});

// GET - Obtener facturas vencidas
router.get('/stats/vencidas', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM facturacion 
       WHERE fecha_vencimiento < CURDATE() 
       AND estado_factura NOT IN ('pagada', 'anulada')
       ORDER BY fecha_vencimiento ASC`
    );
    
    const rows = Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener facturas vencidas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener facturas vencidas',
      error: error.message
    });
  }
});

// PUT - Registrar pago en factura
router.put('/:id/registrar-pago', async (req, res) => {
  try {
    const { monto_pago } = req.body;

    if (!monto_pago || parseFloat(monto_pago) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto del pago debe ser mayor a 0'
      });
    }

    const result = await db.query(
      'SELECT total, monto_pagado, saldo_pendiente FROM facturacion WHERE id_factura = ?',
      [req.params.id]
    );
    const factura = Array.isArray(result[0]) ? result[0] : result;

    if (factura.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }

    const nuevoMontoPagado = parseFloat(factura[0].monto_pagado) + parseFloat(monto_pago);
    const nuevoSaldo = parseFloat(factura[0].total) - nuevoMontoPagado;

    let nuevoEstado = 'emitida';
    if (nuevoSaldo <= 0) {
      nuevoEstado = 'pagada';
    } else if (nuevoMontoPagado > 0) {
      nuevoEstado = 'pagada_parcial';
    }

    await db.query(
      `UPDATE facturacion SET
        monto_pagado = ?,
        saldo_pendiente = ?,
        estado_factura = ?
      WHERE id_factura = ?`,
      [nuevoMontoPagado, Math.max(0, nuevoSaldo), nuevoEstado, req.params.id]
    );

    res.json({
      success: true,
      message: 'Pago registrado exitosamente',
      data: {
        monto_pagado: nuevoMontoPagado,
        saldo_pendiente: Math.max(0, nuevoSaldo),
        estado_factura: nuevoEstado
      }
    });
  } catch (error) {
    console.error('Error al registrar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar el pago',
      error: error.message
    });
  }
});

module.exports = router;