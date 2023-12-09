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


app.engine("handlebars", exphbs.create({}).engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/products", async (req, res) => {
  const { limit } = req.query;
  let allProducts = await productos.getProducts();

  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit)) {
      allProducts = allProducts.slice(0, parsedLimit);
    }
  }

  res.json(allProducts);
});

app.get("/api/products/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  if (!isNaN(productId)) {
    const product = await productos.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } else {
    res.status(400).json({ error: "ID de producto no válido" });
  }
});

app.get("/home", async (req, res) => {
  const allProducts = await productos.getProducts();
  console.log("Productos:", allProducts);
  res.render("home", { products: allProducts });
});

app.get("/realtimeproducts", async (req, res) => {
  const allProducts = await productos.getProducts();
  res.render("realTimeProducts", { products: allProducts });
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
});

app.post("/api/carts", async (req, res) => {
  const cartId = await carritos.createCart();
  io.emit("updateCarts", await carritos.getCarts());
  res.json({ cartId });
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const port = 8081;
server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
