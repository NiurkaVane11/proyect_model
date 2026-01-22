const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todos los anunciantes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM anunciantes ORDER BY fecha_registro DESC');
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener anunciantes:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET - Obtener un anunciante por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM anunciantes WHERE id_anunciante = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anunciante no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener anunciante:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST - Crear nuevo anunciante
router.post('/', async (req, res) => {
  try {
    const {
      razon_social,
      nombre_comercial,
      ruc,
      sector_comercial,
      nombre_contacto,
      cargo_contacto,
      telefono,
      celular,
      email,
      direccion,
      ciudad,
      provincia,
      sitio_web,
      redes_sociales,
      forma_pago_preferida,
      limite_credito,
      observaciones
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO anunciantes 
      (razon_social, nombre_comercial, ruc, sector_comercial, nombre_contacto, 
       cargo_contacto, telefono, celular, email, direccion, ciudad, provincia, 
       sitio_web, redes_sociales, forma_pago_preferida, limite_credito, observaciones) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [razon_social, nombre_comercial, ruc, sector_comercial, nombre_contacto,
       cargo_contacto, telefono, celular, email, direccion, ciudad, provincia,
       sitio_web, redes_sociales, forma_pago_preferida, limite_credito, observaciones]
    );

    res.status(201).json({
      success: true,
      message: 'Anunciante creado exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear anunciante:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT - Actualizar anunciante
router.put('/:id', async (req, res) => {
  try {
    const {
      razon_social,
      nombre_comercial,
      ruc,
      sector_comercial,
      nombre_contacto,
      cargo_contacto,
      telefono,
      celular,
      email,
      direccion,
      ciudad,
      provincia,
      sitio_web,
      redes_sociales,
      forma_pago_preferida,
      limite_credito,
      estado,
      observaciones
    } = req.body;

    const [result] = await db.query(
      `UPDATE anunciantes SET 
      razon_social=?, nombre_comercial=?, ruc=?, sector_comercial=?, nombre_contacto=?,
      cargo_contacto=?, telefono=?, celular=?, email=?, direccion=?, ciudad=?, provincia=?,
      sitio_web=?, redes_sociales=?, forma_pago_preferida=?, limite_credito=?, estado=?, observaciones=?
      WHERE id_anunciante=?`,
      [razon_social, nombre_comercial, ruc, sector_comercial, nombre_contacto,
       cargo_contacto, telefono, celular, email, direccion, ciudad, provincia,
       sitio_web, redes_sociales, forma_pago_preferida, limite_credito, estado, observaciones, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anunciante no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Anunciante actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar anunciante:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE - Cambiar estado a inactivo
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE anunciantes SET estado = ? WHERE id_anunciante = ?',
      ['inactivo', req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Anunciante no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Anunciante desactivado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar anunciante:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;