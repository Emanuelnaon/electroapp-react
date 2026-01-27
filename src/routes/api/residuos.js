// backend/src/routes/api/residuos.js

const express = require('express');
const router = express.Router();
const residuoController = require('../../controllers/residuoController');
const { authenticateToken, requireRole } = require('../../middleware/auth');

// ✅ Ruta PÚBLICA (sin middleware)
router.get('/tipos', residuoController.obtenerTiposResiduos);

// 🔐 Ruta PROTEGIDA (requiere login)
router.post(
  '/solicitar', 
  authenticateToken,  // ← Solo usuarios logueados
  residuoController.solicitarRecogida
);

// 🔒 Ruta ADMIN (requiere login + rol específico)
router.delete(
  '/:id', 
  authenticateToken,  // ← Debe estar logueado
  requireRole(['admin', 'oro']),  // ← Y tener nivel admin u oro
  residuoController.eliminarResiduo
);

module.exports = router;