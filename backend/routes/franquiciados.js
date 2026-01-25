const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ✅ Stats
router.get('/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado = 'prospecto' THEN 1 ELSE 0 END) as prospectos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
        IFNULL(SUM(capital_disponible), 0) as capital_total
      FROM franquiciados
    `);

    console.log('📊 Query result completo:', result);
    
    // Verifica si result es array o directo
    const rows = Array.isArray(result) ? (Array.isArray(result[0]) ? result[0] : result) : [result];
    const stats = rows[0] || {};
    
    console.log('📊 Stats extraídas:', stats);
    
    const dataFormateada = {
      total: parseInt(String(stats.total)) || 0,
      activos: parseInt(String(stats.activos)) || 0,
      prospectos: parseInt(String(stats.prospectos)) || 0,
      inactivos: parseInt(String(stats.inactivos)) || 0,
      capital_total: parseFloat(String(stats.capital_total)) || 0
    };

    console.log('✅ Stats formateadas:', dataFormateada);
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
    
    console.log('🔍 Query result completo:', result);
    console.log('🔍 Es array?:', Array.isArray(result));
    console.log('🔍 Primer elemento:', result[0]);
    
    // Verifica si result es array de arrays o directo
    const rows = Array.isArray(result[0]) && result[0].length > 0 && result[0][0].id_franquiciado 
      ? result[0] 
      : result;
    
    console.log('📋 Rows finales:', rows?.length, 'registros');
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Error listar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM franquiciados WHERE id_franquiciado = ?', [req.params.id]);
    const rows = Array.isArray(result[0]) ? result[0] : result;
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No encontrado' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('❌ Error getById:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Crear
router.post('/', async (req, res) => {
  try {
    const result = await db.query('INSERT INTO franquiciados SET ?', [req.body]);
    const insertId = result.insertId || result[0]?.insertId;
    
    res.status(201).json({
      success: true,
      message: 'Franquiciado creado',
      data: { id_franquiciado: parseInt(insertId) }
    });
  } catch (error) {
    console.error('❌ Error crear:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Actualizar
router.put('/:id', async (req, res) => {
  try {
    await db.query('UPDATE franquiciados SET ? WHERE id_franquiciado = ?', [req.body, req.params.id]);
    res.json({ success: true, message: 'Actualizado' });
  } catch (error) {
    console.error('❌ Error actualizar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Eliminar
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM franquiciados WHERE id_franquiciado = ?', [req.params.id]);
    res.json({ success: true, message: 'Eliminado' });
  } catch (error) {
    console.error('❌ Error eliminar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


