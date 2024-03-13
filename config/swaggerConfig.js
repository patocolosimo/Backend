const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for the API endpoints",
    },
  },
  apis: ["./routes/productRoutes.js", "./routes/cartRoutes.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
