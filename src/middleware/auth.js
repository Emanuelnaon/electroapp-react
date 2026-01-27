// backend/src/middleware/auth.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// 🛡️ Middleware para proteger rutas
exports.authenticateToken = (req, res, next) => {
  try {
    // 1. Obtener el token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        error: 'Token no proporcionado. Debes estar logueado.' 
      });
    }

    // 2. Verificar el token
    jwt.verify(token, JWT_SECRET, (err, usuario) => {
      if (err) {
        return res.status(403).json({ 
          error: 'Token inválido o expirado' 
        });
      }

      // 3. Guardar los datos del usuario en la request
      req.usuario = usuario; // Ahora req.usuario tiene {userId, email, nivel}
      next(); // Continuar con la siguiente función
    });

  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ error: 'Error al verificar token' });
  }
};

// 🔒 Middleware para verificar roles específicos
exports.requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const nivelUsuario = req.usuario.nivel;

    if (!rolesPermitidos.includes(nivelUsuario)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción' 
      });
    }

    next();
  };
};