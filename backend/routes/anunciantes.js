const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Obtener todos los anunciantes
router.get('/', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM anunciantes ORDER BY id_anunciante DESC');
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

    console.log('Datos recibidos:', req.body);

    const result = await pool.query(
      `INSERT INTO anunciantes (
        razon_social, nombre_comercial, ruc, sector_comercial,
        nombre_contacto, cargo_contacto, telefono, celular, email,
        direccion, ciudad, provincia, sitio_web, redes_sociales,
        forma_pago_preferida, limite_credito, observaciones, usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        observaciones,
        'admin'
      ]
    );

    console.log('Anunciante creado con ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'Anunciante creado exitosamente',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error al crear anunciante:', error);
    console.error('Detalles del error:', error.message);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
    
    res.status(500).json({
      success: false,
      message: 'Error al crear anunciante',
      error: error.message,
      details: error.sqlMessage || error.toString()
    });
  }
});

// PUT - Actualizar anunciante
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remover campos que no se deben actualizar
    delete updates.id_anunciante;
    delete updates.fecha_registro;
    
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