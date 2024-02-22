const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://patocolosimo:Magunita86@cluster0.xmvg5am.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Conexión a MongoDB exitosa');
  } catch (error) {
    logger.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
