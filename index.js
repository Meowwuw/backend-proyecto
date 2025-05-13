const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Cargar rutas
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Para leer JSON en el body

// Rutas
app.use('/api', authRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
