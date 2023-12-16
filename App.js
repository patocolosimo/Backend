const express = require("express");
const http = require("http");
const exphbs = require("express-handlebars");
const socketIo = require("socket.io");
const mongoose = require('mongoose');
const ProductManager = require("./src/dao/ProductManager");
const CartManager = require("./src/dao/CartManager");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
const productos = new ProductManager();
const carritos = new CartManager();

mongoose.connect('mongodb+srv://patocolosimo:Magunita86@cluster0.xmvg5am.mongodb.net/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

app.engine("handlebars", exphbs.create({ /* Configuración de Handlebars aquí */ }).engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/products', async (req, res) => {

  res.send('Implementa la lógica para mostrar todos los productos con paginación');
});
app.get('/products/:pid', async (req, res) => {
  res.send('Implementa la lógica para mostrar detalles de un producto específico');
});
app.get('/carts/:cid', async (req, res) => {
  res.send('Implementa la lógica para mostrar un carrito específico');
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addToCart", async ({ cartId, productId, quantity }) => {
    const success = await carritos.addProductToCart(cartId, productId, quantity);
    if (success) {
      io.emit("updateCarts", await carritos.getCarts());
    }
  });
});

app.post("/api/carts", async (req, res) => {
  const cartId = await carritos.createCart();
  io.emit("updateCarts", await carritos.getCarts());
  res.json({ cartId });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = 8081;
server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
