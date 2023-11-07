const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const app = express();
const port = 8080;

const productos = new ProductManager('products.json');
const carritos = new CartManager('cart.json');

app.use(express.json());

app.get('/api/products', (req, res) => {
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

app.get('/api/products/:pid', (req, res) => {
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

app.post('/api/carts', (req, res) => {
  const cartId = carritos.createCart();
  res.json({ cartId });
});

app.get('/api/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carritos.getCart(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  const success = carritos.addProductToCart(cartId, productId, quantity); 
  if (success) {
    res.json({ message: 'Producto agregado al carrito' });
  } else {
    res.status(404).json({ error: 'Producto o carrito no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
