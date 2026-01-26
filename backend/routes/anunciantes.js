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

// POST - Crear nuevo anunciante usando STORED PROCEDURE
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
      limite_credito
    } = req.body;

    console.log('Datos recibidos:', req.body);

    // Llamar al procedimiento almacenado
    const result = await pool.query(
      `CALL sp_registrar_anunciante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        razon_social,
        nombre_comercial || null,
        ruc,
        sector_comercial || null,
        nombre_contacto || null,
        cargo_contacto || null,
        telefono || null,
        celular || null,
        email,
        direccion || null,
        ciudad || null,
        provincia || null,
        sitio_web || null,
        redes_sociales || null,
        forma_pago_preferida || null,
        limite_credito || null
      ]
    );

    // El SP retorna un resultado con mensaje e id
    const spResult = result[0][0];
    
    console.log('Resultado del SP:', spResult);

    res.status(201).json({
      success: true,
      message: spResult.mensaje || 'Anunciante creado exitosamente',
      data: { id: spResult.id_anunciante }
    });
    
  } catch (error) {
    console.error('Error al crear anunciante:', error);
    console.error('Detalles del error:', error.message);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
    
    // Manejar errores de validación (RUC inválido o duplicado)
    if (error.sqlState === '45000') {
      return res.status(400).json({
        success: false,
        message: error.sqlMessage || 'Error de validación',
        error: error.message
      });
    }
    
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
    const updates = { ...req.body }; // Crear copia del objeto
    
    // 🔍 VALIDACIÓN: Si se está actualizando el RUC, validar longitud
    if (updates.ruc) {
      if (updates.ruc.length < 10 || updates.ruc.length > 13) {
        return res.status(400).json({
          success: false,
          message: 'RUC inválido: debe tener entre 10 y 13 caracteres'
        });
      }
    }

    // Remover campos que no se deben actualizar
    delete updates.id_anunciante;
    delete updates.fecha_registro;
    
    // Verificar que hay campos para actualizar
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }
    
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), id];
    
    const result = await pool.query(
      `UPDATE anunciantes SET ${fields} WHERE id_anunciante = ?`,
      values
    );

    // Verificar si se actualizó algún registro
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
    
    // Manejar errores del trigger de validación
    if (error.sqlState === '45000') {
      return res.status(400).json({
        success: false,
        message: error.sqlMessage || 'Error de validación',
        error: error.message
      });
    }
    
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
    
    // Primero verificar si existe
    const exists = await pool.query(
      'SELECT id_anunciante FROM anunciantes WHERE id_anunciante = ?',
      [id]
    );
    
    if (exists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Anunciante no encontrado'
      });
    }
    
    // Eliminar el anunciante
    await pool.query(
      'DELETE FROM anunciantes WHERE id_anunciante = ?',
      [id]
    );

    console.log('Anunciante eliminado con ID:', id);

    res.json({
      success: true,
      message: 'Anunciante eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar anunciante:', error);
    
    // Si hay error de foreign key constraint
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el anunciante porque tiene registros asociados',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al eliminar anunciante',
      error: error.message
    });
  }
});

module.exports = router;