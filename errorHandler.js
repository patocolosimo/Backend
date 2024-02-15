const errorDictionary = {
    // Errores comunes al crear un producto
    createProductErrors: {
      PRODUCT_ALREADY_EXISTS: "El producto ya existe.",
      INVALID_PRODUCT_DATA: "Los datos del producto son inválidos.",
      DATABASE_ERROR: "Error al crear el producto en la base de datos.",
    },
    // Errores comunes al agregar un producto al carrito
    addToCartErrors: {
      PRODUCT_NOT_FOUND: "Producto no encontrado.",
      NOT_ENOUGH_STOCK: "No hay suficiente stock del producto.",
      DATABASE_ERROR: "Error al agregar el producto al carrito.",
    }
  };
  
  module.exports = { errorDictionary };
  
