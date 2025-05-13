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

//No se olviden de exportar
module.exports = router;
