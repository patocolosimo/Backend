const express = require('express');
const ProductManager = require('./ProductManager'); 

const app = express();
const port = 3000; 

const productos = new ProductManager('products.json');

app.get('/products', (req, res) => {
  const { limit } = req.query;

  let allProducts = productos.getProducts();

  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit)) {
      allProducts = allProducts.slice(0, parsedLimit);
    }
  }

  res.json(allProducts);
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  if (!isNaN(productId)) {
    const product = productos.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } else {
    res.status(400).json({ error: 'ID de producto no válido' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
