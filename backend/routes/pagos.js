const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todos los pagos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        f.nombres as franquiciado_nombres,
        f.apellidos as franquiciado_apellidos,
        fr.nombre_comercial as franquicia_nombre
      FROM pagos p
      LEFT JOIN franquiciados f ON p.id_franquiciado = f.id_franquiciado
      LEFT JOIN franquicias fr ON p.id_franquicia = fr.id_franquicia
      ORDER BY p.fecha_pago DESC
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
      SELECT 
        p.*,
        f.nombres as franquiciado_nombres,
        f.apellidos as franquiciado_apellidos,
        fr.nombre_comercial as franquicia_nombre
      FROM pagos p
      LEFT JOIN franquiciados f ON p.id_franquiciado = f.id_franquiciado
      LEFT JOIN franquicias fr ON p.id_franquicia = fr.id_franquicia
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
      id_franquiciado,
      id_franquicia,
      tipo_pago,
      monto,
      fecha_pago,
      metodo_pago,
      numero_comprobante,
      estado,
      observaciones
    } = req.body;

    const query = `
      INSERT INTO pagos (
        id_franquiciado,
        id_franquicia,
        tipo_pago,
        monto,
        fecha_pago,
        metodo_pago,
        numero_comprobante,
        estado,
        observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(query, [
      id_franquiciado,
      id_franquicia,
      tipo_pago,
      monto,
      fecha_pago,
      metodo_pago,
      numero_comprobante || null,
      estado || 'pendiente',
      observaciones || null
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
      id_franquiciado,
      id_franquicia,
      tipo_pago,
      monto,
      fecha_pago,
      metodo_pago,
      numero_comprobante,
      estado,
      observaciones
    } = req.body;

    const query = `
      UPDATE pagos SET
        id_franquiciado = ?,
        id_franquicia = ?,
        tipo_pago = ?,
        monto = ?,
        fecha_pago = ?,
        metodo_pago = ?,
        numero_comprobante = ?,
        estado = ?,
        observaciones = ?
      WHERE id_pago = ?
    `;

    const result = await db.query(query, [
      id_franquiciado,
      id_franquicia,
      tipo_pago,
      monto,
      fecha_pago,
      metodo_pago,
      numero_comprobante,
      estado,
      observaciones,
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
    const query = 'DELETE FROM pagos WHERE id_pago = ?';
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

// GET - Obtener pagos por franquiciado
router.get('/franquiciado/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        fr.nombre_comercial as franquicia_nombre
      FROM pagos p
      LEFT JOIN franquicias fr ON p.id_franquicia = fr.id_franquicia
      WHERE p.id_franquiciado = ?
      ORDER BY p.fecha_pago DESC
    `;
    
    const result = await db.query(query, [req.params.id]);
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener pagos del franquiciado:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Obtener pagos por franquicia
router.get('/franquicia/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        f.nombres as franquiciado_nombres,
        f.apellidos as franquiciado_apellidos
      FROM pagos p
      LEFT JOIN franquiciados f ON p.id_franquiciado = f.id_franquiciado
      WHERE p.id_franquicia = ?
      ORDER BY p.fecha_pago DESC
    `;
    
    const result = await db.query(query, [req.params.id]);
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener pagos de la franquicia:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;