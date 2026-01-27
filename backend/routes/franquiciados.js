const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Función helper para extraer rows de la respuesta de MySQL/MariaDB
const extractRows = (result) => {
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0];
  }
  if (Array.isArray(result)) {
    return result;
  }
  if (result.rows) {
    return result.rows;
  }
  return [];
};

// ✅ Stats
router.get('/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado = 'prospecto' THEN 1 ELSE 0 END) as prospectos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
        COALESCE(SUM(capital_disponible), 0) as capital_total
      FROM franquiciados
    `);

    const rows = extractRows(result);
    const stats = rows[0] || {};
    
    const dataFormateada = {
      total: parseInt(stats.total) || 0,
      activos: parseInt(stats.activos) || 0,
      prospectos: parseInt(stats.prospectos) || 0,
      inactivos: parseInt(stats.inactivos) || 0,
      capital_total: parseFloat(stats.capital_total) || 0
    };

    console.log('✅ Stats:', dataFormateada);
    res.json({ success: true, data: dataFormateada });
    
  } catch (error) {
    console.error('❌ Error stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Listar todos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM franquiciados ORDER BY fecha_registro DESC');
    const rows = extractRows(result);
    
    console.log(`📋 ${rows.length} franquiciados encontrados`);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Error listar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM franquiciados WHERE id_franquiciado = ?', 
      [req.params.id]
    );
    const rows = extractRows(result);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Franquiciado no encontrado' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('❌ Error getById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Crear - SIN usuario_registro
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
      observaciones
    } = req.body;

    // Validar campos requeridos (NOT NULL en la BD)
    if (!nombres || !apellidos || !cedula_ruc || !email || !telefono || !ciudad || !provincia) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: nombres, apellidos, cedula_ruc, email, telefono, ciudad, provincia'
      });
    }

    // Verificar si ya existe cédula o email
    const checkResult = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE cedula_ruc = ? OR email = ?',
      [cedula_ruc, email]
    );
    const existentes = extractRows(checkResult);

    if (existentes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un franquiciado con esa cédula o email'
      });
    }

    // Insertar SIN usuario_registro
    const result = await db.query(
      `INSERT INTO franquiciados (
        nombres, apellidos, cedula_ruc, email, telefono, celular,
        direccion, ciudad, provincia, fecha_nacimiento, estado_civil,
        profesion, experiencia_previa, capital_disponible,
        referencias_comerciales, estado, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        observaciones || null
      ]
    );
    
    let insertId = result.insertId;
    if (!insertId && result[0]) {
      insertId = result[0].insertId;
    }
    
    console.log('✅ Franquiciado creado con ID:', insertId);
    
    res.status(201).json({
      success: true,
      message: 'Franquiciado creado exitosamente',
      data: { id_franquiciado: parseInt(insertId) }
    });
  } catch (error) {
    console.error('❌ Error crear:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un franquiciado con esa cédula o email'
      });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Actualizar - SIN usuario_registro
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
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

    // Validar campos requeridos
    if (!nombres || !apellidos || !cedula_ruc || !email || !telefono || !ciudad || !provincia) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: nombres, apellidos, cedula_ruc, email, telefono, ciudad, provincia'
      });
    }
    
    // Verificar que existe
    const checkResult = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE id_franquiciado = ?',
      [id]
    );
    const existe = extractRows(checkResult);
    
    if (existe.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Franquiciado no encontrado'
      });
    }

    // Verificar duplicados
    const dupResult = await db.query(
      'SELECT id_franquiciado FROM franquiciados WHERE (cedula_ruc = ? OR email = ?) AND id_franquiciado != ?',
      [cedula_ruc, email, id]
    );
    const duplicados = extractRows(dupResult);
    
    if (duplicados.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro franquiciado con esa cédula o email'
      });
    }

    // Actualizar SIN usuario_registro
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
        id
      ]
    );
    
    console.log('✅ Franquiciado actualizado:', id);
    res.json({ success: true, message: 'Franquiciado actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error actualizar:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro franquiciado con esa cédula o email'
      });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM franquiciados WHERE id_franquiciado = ?',
      [req.params.id]
    );
    
    const affectedRows = result.affectedRows || (result[0] && result[0].affectedRows) || 0;
    
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Franquiciado no encontrado'
      });
    }
    
    console.log('✅ Franquiciado eliminado:', req.params.id);
    res.json({ success: true, message: 'Franquiciado eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;