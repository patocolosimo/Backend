const express = require("express");
const http = require("http");
const exphbs = require("express-handlebars");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const UserManager = require("./src/dao/UserManager");
const User = require("./src/dao/models/user");

const ProductManager = require("./src/dao/ProductManager");
const CartManager = require("./src/dao/CartManager");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));
const productos = new ProductManager();
const carritos = new CartManager();

mongoose.connect(
  "mongodb+srv://patocolosimo:Magunita86@cluster0.xmvg5am.mongodb.net/ecommerce",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

app.engine("handlebars", exphbs.create({ defaultLayout: "main" }).engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de Passport y la sesión
const sessionConfig = {
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.get("/products", isLoggedIn, async (req, res) => {
  const user = req.user;

  // Verifica el rol del usuario
  let role = "Usuario";
  if (user && user.role === "admin") {
    role = "Admin";
  }

  res.render("realTimeProducts", { user, role });
});

app.get("/products/:pid", isLoggedIn, async (req, res) => {
  res.render("productDetails");
});

app.get("/carts/:cid", isLoggedIn, async (req, res) => {
  res.render("cartDetails");
});

// Nueva ruta para /home
app.get("/home", isLoggedIn, (req, res) => {
  res.render("home");
});

// Ruta para el formulario de inicio de sesión
app.get("/login", (req, res) => {
  res.render("login/login");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addToCart", async ({ cartId, productId, quantity }) => {
    const success = await carritos.addProductToCart(
      cartId,
      productId,
      quantity
    );
    if (success) {
      io.emit("updateCarts", await carritos.getCarts());
    }
  });
});

// API para crear carrito
app.post("/api/carts", async (req, res) => {
  const cartId = await carritos.createCart();
  io.emit("updateCarts", await carritos.getCarts());
  res.json({ cartId });
});

// Logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// Middleware para verificar si el usuario está autenticado y tiene el rol necesario
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    const user = req.user;
    if (user && user.role === "admin") {
      return next(); // Usuario autenticado con rol de administrador
    } else {
      return res.redirect("/login");
    }
  }
  res.redirect("/login");
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo ha salido mal.");
});

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

const port = 8081;
const host = '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
