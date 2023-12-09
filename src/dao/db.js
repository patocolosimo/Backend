
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://<usuario>:<contraseña>@cluster0.xmvg5am.mongodb.net/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
