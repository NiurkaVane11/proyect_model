const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todos los pagos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*
      FROM pagos_franquicia p
      ORDER BY p.fecha_registro DESC
    `;
    
    const result = await db.query(query);
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obtener un pago por ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT p.*
      FROM pagos_franquicia p
      WHERE p.id_pago = ?
    `;
    
    const result = await db.query(query, [req.params.id]);
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Crear nuevo pago
router.post('/', async (req, res) => {
  try {
    const {
      tipo_pago,
      numero_factura,
      fecha_emision,
      fecha_vencimiento,
      fecha_pago,
      monto_total,
      monto_pagado,
      saldo,
      metodo_pago,
      numero_comprobante,
      estado_pago,
      observaciones,
      usuario_registro
    } = req.body;

    const query = `
      INSERT INTO pagos_franquicia (
        tipo_pago,
        numero_factura,
        fecha_emision,
        fecha_vencimiento,
        fecha_pago,
        monto_total,
        monto_pagado,
        saldo,
        metodo_pago,
        numero_comprobante,
        estado_pago,
        observaciones,
        usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(query, [
      tipo_pago,
      numero_factura || null,
      fecha_emision,
      fecha_vencimiento,
      fecha_pago || null,
      monto_total,
      monto_pagado || 0.00,
      saldo || monto_total,
      metodo_pago || null,
      numero_comprobante || null,
      estado_pago || 'pendiente',
      observaciones || null,
      usuario_registro || 'admin'
    ]);

    const insertId = result.insertId || result[0]?.insertId;

    res.status(201).json({
      success: true,
      data: { id_pago: insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Actualizar pago existente
router.put('/:id', async (req, res) => {
  try {
    const {
      tipo_pago,
      numero_factura,
      fecha_emision,
      fecha_vencimiento,
      fecha_pago,
      monto_total,
      monto_pagado,
      saldo,
      metodo_pago,
      numero_comprobante,
      estado_pago,
      observaciones,
      usuario_registro
    } = req.body;

    const query = `
      UPDATE pagos_franquicia SET
        tipo_pago = ?,
        numero_factura = ?,
        fecha_emision = ?,
        fecha_vencimiento = ?,
        fecha_pago = ?,
        monto_total = ?,
        monto_pagado = ?,
        saldo = ?,
        metodo_pago = ?,
        numero_comprobante = ?,
        estado_pago = ?,
        observaciones = ?,
        usuario_registro = ?
      WHERE id_pago = ?
    `;

    const result = await db.query(query, [
      tipo_pago,
      numero_factura,
      fecha_emision,
      fecha_vencimiento,
      fecha_pago,
      monto_total,
      monto_pagado,
      saldo,
      metodo_pago,
      numero_comprobante,
      estado_pago,
      observaciones,
      usuario_registro,
      req.params.id
    ]);

    const affectedRows = result.affectedRows || result[0]?.affectedRows;

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    res.json({ success: true, data: { id_pago: req.params.id, ...req.body } });
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Eliminar pago
router.delete('/:id', async (req, res) => {
  try {
    const query = 'DELETE FROM pagos_franquicia WHERE id_pago = ?';
    const result = await db.query(query, [req.params.id]);

    const affectedRows = result.affectedRows || result[0]?.affectedRows;

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Pago no encontrado' });
    }

    res.json({ success: true, message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;