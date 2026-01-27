const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Función mejorada para formatear fechas al formato MySQL (YYYY-MM-DD)
function formatDateForMySQL(date) {
  if (!date) return null;
  
  try {
    // Si ya viene en formato YYYY-MM-DD, devolverlo tal cual
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    const d = new Date(date);
    
    // Verificar si la fecha es válida
    if (isNaN(d.getTime())) {
      return null;
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error al formatear fecha:', date, error);
    return null;
  }
}

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

    // Log para debug - ver qué está llegando
    console.log('===== DATOS RECIBIDOS EN POST =====');
    console.log('fecha_emision:', fecha_emision);
    console.log('fecha_vencimiento:', fecha_vencimiento);
    console.log('fecha_pago:', fecha_pago);
    console.log('Body completo:', req.body);

    // Validar que fecha_emision no esté vacía
    if (!fecha_emision) {
      return res.status(400).json({ 
        success: false, 
        error: 'La fecha de emisión es obligatoria' 
      });
    }

    // Formatear fechas
    const fechaEmisionFormateada = formatDateForMySQL(fecha_emision);
    const fechaVencimientoFormateada = formatDateForMySQL(fecha_vencimiento);
    const fechaPagoFormateada = formatDateForMySQL(fecha_pago);

    // Log para debug - ver fechas formateadas
    console.log('===== FECHAS FORMATEADAS =====');
    console.log('fechaEmisionFormateada:', fechaEmisionFormateada);
    console.log('fechaVencimientoFormateada:', fechaVencimientoFormateada);
    console.log('fechaPagoFormateada:', fechaPagoFormateada);

    // Validar que la fecha formateada no sea null
    if (!fechaEmisionFormateada) {
      return res.status(400).json({ 
        success: false, 
        error: 'La fecha de emisión tiene un formato inválido' 
      });
    }

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
      fechaEmisionFormateada,
      fechaVencimientoFormateada,
      fechaPagoFormateada,
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

    console.log('===== PAGO CREADO EXITOSAMENTE =====');
    console.log('ID:', insertId);

    res.status(201).json({
      success: true,
      data: { id_pago: insertId, ...req.body }
    });
  } catch (error) {
    console.error('===== ERROR AL CREAR PAGO =====');
    console.error('Error completo:', error);
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

    // Log para debug
    console.log('===== DATOS RECIBIDOS EN PUT =====');
    console.log('ID a actualizar:', req.params.id);
    console.log('fecha_emision:', fecha_emision);
    console.log('fecha_vencimiento:', fecha_vencimiento);
    console.log('fecha_pago:', fecha_pago);

    // Formatear fechas
    const fechaEmisionFormateada = formatDateForMySQL(fecha_emision);
    const fechaVencimientoFormateada = formatDateForMySQL(fecha_vencimiento);
    const fechaPagoFormateada = formatDateForMySQL(fecha_pago);

    console.log('===== FECHAS FORMATEADAS =====');
    console.log('fechaEmisionFormateada:', fechaEmisionFormateada);
    console.log('fechaVencimientoFormateada:', fechaVencimientoFormateada);
    console.log('fechaPagoFormateada:', fechaPagoFormateada);

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
      fechaEmisionFormateada,
      fechaVencimientoFormateada,
      fechaPagoFormateada,
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

    console.log('===== PAGO ACTUALIZADO EXITOSAMENTE =====');

    res.json({ success: true, data: { id_pago: req.params.id, ...req.body } });
  } catch (error) {
    console.error('===== ERROR AL ACTUALIZAR PAGO =====');
    console.error('Error completo:', error);
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

    console.log('===== PAGO ELIMINADO EXITOSAMENTE =====');
    console.log('ID eliminado:', req.params.id);

    res.json({ success: true, message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error('===== ERROR AL ELIMINAR PAGO =====');
    console.error('Error completo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;