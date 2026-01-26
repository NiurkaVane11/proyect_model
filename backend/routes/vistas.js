const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET - Anunciantes por sector comercial
router.get('/anunciantes-por-sector', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vista_anunciantes_por_sector ORDER BY total DESC');
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener vista anunciantes por sector:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de anunciantes por sector',
      error: error.message
    });
  }
});

module.exports = router;