require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

module.exports = {
    mongodbURI: process.env.MONGODB_URI, // URI de conexión a MongoDB
    sessionSecret: process.env.SESSION_SECRET, // Clave secreta para la sesión
    githubClientID: process.env.GITHUB_CLIENT_ID, // ID de cliente de GitHub para autenticación
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET, // Clave secreta de cliente de GitHub para autenticación
    port: process.env.PORT || 8081, // Puerto en el que se ejecutará el servidor
    host: process.env.HOST || '0.0.0.0' // Host al que se vinculará el servidor
};
