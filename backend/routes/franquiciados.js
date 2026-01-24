const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Obtener todos los franquiciados
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM franquiciados ORDER BY fecha_registro DESC'
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener franquiciados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los franquiciados',
      error: error.message
    });
  }
});

// GET - Obtener un franquiciado por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM franquiciados WHERE id_franquiciado = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Franquiciado no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener franquiciado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el franquiciado',
      error: error.message
    });
  }
});

// POST - Crear un nuevo franquiciado
router.post('/', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      cedula_ruc,
      email,
      telefono,
      celular,
      direccion,
      ciudad,
      provincia,
      fecha_nacimiento,
      estado_civil,
      profesion,
      experiencia_previa,
      capital_disponible,
      referencias_comerciales,
      estado,
      observaciones,
      usuario_registro
    } = req.body;

    // Validaciones básicas
    if (!nombres || !apellidos || !cedula_ruc || !email || !telefono || !ciudad || !provincia) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    // Verificar si ya existe la cédula/RUC
    const [existing] = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE cedula_ruc = ?',
      [cedula_ruc]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un franquiciado con esta cédula/RUC'
      });
    }

    // Verificar si ya existe el email
    const [existingEmail] = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un franquiciado con este email'
      });
    }

    const [result] = await db.query(
      `INSERT INTO franquiciados (
        nombres, apellidos, cedula_ruc, email, telefono, celular,
        direccion, ciudad, provincia, fecha_nacimiento, estado_civil,
        profesion, experiencia_previa, capital_disponible,
        referencias_comerciales, estado, observaciones, usuario_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombres,
        apellidos,
        cedula_ruc,
        email,
        telefono,
        celular || null,
        direccion || null,
        ciudad,
        provincia,
        fecha_nacimiento || null,
        estado_civil || null,
        profesion || null,
        experiencia_previa || null,
        capital_disponible || null,
        referencias_comerciales || null,
        estado || 'prospecto',
        observaciones || null,
        usuario_registro || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Franquiciado creado exitosamente',
      data: {
        id_franquiciado: result.insertId
      }
    });
  } catch (error) {
    console.error('Error al crear franquiciado:', error);
    
    // Manejar errores de duplicados
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un franquiciado con esta cédula/RUC o email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear el franquiciado',
      error: error.message
    });
  }
});

// PUT - Actualizar un franquiciado
router.put('/:id', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      cedula_ruc,
      email,
      telefono,
      celular,
      direccion,
      ciudad,
      provincia,
      fecha_nacimiento,
      estado_civil,
      profesion,
      experiencia_previa,
      capital_disponible,
      referencias_comerciales,
      estado,
      observaciones
    } = req.body;

    // Validaciones básicas
    if (!nombres || !apellidos || !cedula_ruc || !email || !telefono || !ciudad || !provincia) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }

    // Verificar si el franquiciado existe
    const [existing] = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE id_franquiciado = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Franquiciado no encontrado'
      });
    }

    // Verificar si la cédula/RUC ya existe en otro registro
    const [duplicateCedula] = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE cedula_ruc = ? AND id_franquiciado != ?',
      [cedula_ruc, req.params.id]
    );

    if (duplicateCedula.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro franquiciado con esta cédula/RUC'
      });
    }

    // Verificar si el email ya existe en otro registro
    const [duplicateEmail] = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE email = ? AND id_franquiciado != ?',
      [email, req.params.id]
    );

    if (duplicateEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro franquiciado con este email'
      });
    }

    await db.query(
      `UPDATE franquiciados SET
        nombres = ?,
        apellidos = ?,
        cedula_ruc = ?,
        email = ?,
        telefono = ?,
        celular = ?,
        direccion = ?,
        ciudad = ?,
        provincia = ?,
        fecha_nacimiento = ?,
        estado_civil = ?,
        profesion = ?,
        experiencia_previa = ?,
        capital_disponible = ?,
        referencias_comerciales = ?,
        estado = ?,
        observaciones = ?
      WHERE id_franquiciado = ?`,
      [
        nombres,
        apellidos,
        cedula_ruc,
        email,
        telefono,
        celular || null,
        direccion || null,
        ciudad,
        provincia,
        fecha_nacimiento || null,
        estado_civil || null,
        profesion || null,
        experiencia_previa || null,
        capital_disponible || null,
        referencias_comerciales || null,
        estado || 'prospecto',
        observaciones || null,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: 'Franquiciado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar franquiciado:', error);
    
    // Manejar errores de duplicados
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un franquiciado con esta cédula/RUC o email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el franquiciado',
      error: error.message
    });
  }
});

// DELETE - Eliminar un franquiciado
router.delete('/:id', async (req, res) => {
  try {
    // Verificar si el franquiciado existe
    const [existing] = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE id_franquiciado = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Franquiciado no encontrado'
      });
    }

    await db.query(
      'DELETE FROM franquiciados WHERE id_franquiciado = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Franquiciado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar franquiciado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el franquiciado',
      error: error.message
    });
  }
});

// GET - Obtener estadísticas de franquiciados
router.get('/stats/resumen', async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado = 'prospecto' THEN 1 ELSE 0 END) as prospectos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
        SUM(capital_disponible) as capital_total,
        AVG(capital_disponible) as capital_promedio
      FROM franquiciados
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

module.exports = router;