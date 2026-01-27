// backend/src/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ⚠️ NUNCA expongas esta clave, debe estar en .env
const JWT_SECRET = process.env.JWT_SECRET; // Ejemplo: "ElectroApp2026SecretKey!#$"
const JWT_EXPIRES_IN = '7d'; // Token válido por 7 días

// 🔐 REGISTRO DE USUARIO
exports.register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, telefono } = req.body;

    // 1. Verificar si el email ya existe
    const existeUsuario = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (existeUsuario) {
      return res.status(400).json({ 
        error: 'Este email ya está registrado' 
      });
    }

    // 2. Hashear la contraseña (NUNCA guardar contraseñas en texto plano)
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Crear usuario en la base de datos
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        email,
        password_hash: passwordHash,
        nombre,
        apellido,
        telefono,
        puntos: 0,
        nivel: 'bronce'
      }
    });

    // 4. Generar JWT
    const token = jwt.sign(
      { 
        userId: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nivel: nuevoUsuario.nivel
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. Responder (NO devolver la contraseña)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        puntos: nuevoUsuario.puntos,
        nivel: nuevoUsuario.nivel
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// 🔓 LOGIN DE USUARIO
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const usuario = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Email o contraseña incorrectos' 
      });
    }

    // 2. Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ 
        error: 'Email o contraseña incorrectos' 
      });
    }

    // 3. Actualizar última actividad
    await prisma.usuarios.update({
      where: { id: usuario.id },
      data: { ultima_actividad: new Date() }
    });

    // 4. Generar JWT
    const token = jwt.sign(
      { 
        userId: usuario.id,
        email: usuario.email,
        nivel: usuario.nivel
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5. Responder
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        puntos: usuario.puntos,
        nivel: usuario.nivel
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};