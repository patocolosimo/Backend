const winston = require('winston');

// Configuración de los niveles de logging
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  fatal: 5
};

// Configuración de los colores para los niveles de logging
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
  fatal: 'red'
};

// Creación del logger para desarrollo
const developmentLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: 'debug' // Loguea a partir de nivel debug en consola
    })
  ]
});

// Creación del logger para producción
const productionLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }) // Loguea errores en un archivo
  ]
});

// Exports
if (process.env.NODE_ENV === 'production') {
  module.exports = productionLogger;
} else {
  module.exports = developmentLogger;
}
