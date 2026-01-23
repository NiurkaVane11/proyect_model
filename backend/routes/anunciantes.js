const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Obtener todos los anunciantes
router.get('/', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM anunciantes');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener anunciantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener anunciantes',
      error: error.message
    });
  }
});

// GET - Obtener un anunciante por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await pool.query(
      'SELECT * FROM anunciantes WHERE id_anunciante = ?',
      [id]
    );
    
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
      message: 'Error al obtener anunciante',
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

    const result = await pool.query(
      `INSERT INTO anunciantes (
        razon_social, nombre_comercial, ruc, sector_comercial,
        nombre_contacto, cargo_contacto, telefono, celular, email,
        direccion, ciudad, provincia, sitio_web, redes_sociales,
        forma_pago_preferida, limite_credito, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        razon_social, nombre_comercial, ruc, sector_comercial,
        nombre_contacto, cargo_contacto, telefono, celular, email,
        direccion, ciudad, provincia, sitio_web, redes_sociales,
        forma_pago_preferida, limite_credito, observaciones
      ]
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
      message: 'Error al crear anunciante',
      error: error.message
    });
  }
});

// PUT - Actualizar anunciante
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), id];
    
    await pool.query(
      `UPDATE anunciantes SET ${fields} WHERE id_anunciante = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Anunciante actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar anunciante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar anunciante',
      error: error.message
    });
  }
});

// DELETE - Eliminar anunciante
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'DELETE FROM anunciantes WHERE id_anunciante = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Anunciante eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar anunciante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar anunciante',
      error: error.message
    });
  }
});

module.exports = router;