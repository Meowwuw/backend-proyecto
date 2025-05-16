const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre_usuario, correo, contraseña } = req.body;

  // Validación básica
  if (!nombre_usuario || !correo || !contraseña) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  try {
    // Encriptar contraseña
    const hash = await bcrypt.hash(contraseña, 10);
    const fecha = new Date();

    // Insertar en la base de datos
    const query = `
      INSERT INTO usuarios (nombre_usuario, correo, contraseña, fecha_registro)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [nombre_usuario, correo, hash, fecha], (err, result) => {
      if (err) {
        console.error('Error al registrar:', err);
        return res.status(500).send('Error al registrar');
      }

      res.status(201).send('Usuario registrado correctamente');
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).send('Error interno');
  }
});

// Login de usuario
router.post('/login', (req, res) => {
  const { nombre_usuario, contraseña } = req.body;

  // Validación básica
  if (!nombre_usuario || !contraseña) {
    return res.status(400).send('Faltan datos obligatorios');
  }

  // Buscar usuario en la base de datos
  db.query(
    'SELECT * FROM usuarios WHERE nombre_usuario = ?',
    [nombre_usuario],
    async (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).send('Error interno');
      }

      if (results.length === 0) {
        return res.status(401).send('Usuario no encontrado');
      }

      const usuario = results[0];

      // Comparar contraseñas
      const match = await bcrypt.compare(contraseña, usuario.contraseña);

      if (!match) {
        return res.status(401).send('Contraseña incorrecta');
      }

      res.status(200).json({
        mensaje: 'Login exitoso',
        usuario: {
          id: usuario.id,
          nombre_usuario: usuario.nombre_usuario,
          correo: usuario.correo,
        },
      });
    }
  );
});


module.exports = router;
