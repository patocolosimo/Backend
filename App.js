const express = require('express');
const http = require('http');
const exphbs = require('express-handlebars'); 
const socketIo = require('socket.io');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productos = new ProductManager('products.json');
const carritos = new CartManager('cart.json');

app.engine('handlebars', exphbs.create({}).engine);
app.set('view engine', 'handlebars');
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

// Configurar ruta para la vista tradicional
app.get('/home', (req, res) => {
  const allProducts = productos.getProducts();
  console.log('Productos:', allProducts);
  res.render('home', { products: allProducts });
});

// Configurar ruta para la vista en tiempo real con websockets
app.get('/realtimeproducts', (req, res) => {
  const allProducts = productos.getProducts();
  res.render('realTimeProducts', { products: allProducts });
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

app.post('/api/carts', (req, res) => {
  const cartId = carritos.createCart();
  io.emit('updateCarts', carritos.getCarts()); // Emitir actualización a todos los clientes
  res.json({ cartId });
});

// Configurar websockets para manejar eventos específicos
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Manejar el evento de agregar producto al carrito
  socket.on('addToCart', ({ cartId, productId, quantity }) => {
    const success = carritos.addProductToCart(cartId, productId, quantity);
    if (success) {
      io.emit('updateCarts', carritos.getCarts()); // Emitir actualización a todos los clientes
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


const port = 8081;
server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
