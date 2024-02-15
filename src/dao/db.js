const mongoose = require('mongoose');
const logger = require('./logger'); // Importar el módulo de logging

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://<usuario>:<contraseña>@cluster0.xmvg5am.mongodb.net/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Conexión a MongoDB exitosa'); // Utilizar el logger para información
  } catch (error) {
    logger.error('Error al conectar a MongoDB:', error.message); // Utilizar el logger para errores
    process.exit(1);
  }
};

module.exports = connectDB;
