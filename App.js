const express = require("express");
const http = require("http");
const exphbs = require("express-handlebars");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./src/dao/models/user");
const ProductManager = require("./src/dao/ProductManager");
const CartManager = require("./src/dao/CartManager");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));
const productos = new ProductManager();
const carritos = new CartManager();

mongoose.connect("mongodb+srv://patocolosimo:Magunita86@cluster0.xmvg5am.mongodb.net/ecommerce", {
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

app.engine("handlebars", exphbs.create({ defaultLayout: "main" }).engine);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionConfig = {
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        console.log("Intento de inicio de sesión con email:", email);
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          console.log("Error de autenticación local: Usuario o contraseña incorrectos");
          return done(null, false, { message: "Usuario o contraseña incorrectos" });
        }

        let role = user.role || "user";
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          role = "admin";
        }

        console.log("Autenticación local exitosa. Rol del usuario:", role);
        return done(null, { ...user.toObject(), role });
      } catch (error) {
        console.error("Error en la estrategia local:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: "your-github-client-id",
      clientSecret: "your-github-client-secret",
      callbackURL: "http://localhost:8081/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({ email });
          await user.save();
        }

        console.log("Autenticación GitHub exitosa");
        return done(null, user);
      } catch (error) {
        console.error("Error en la estrategia GitHub:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Rutas
app.get("/products", isLoggedIn, async (req, res) => {
  const user = req.user;
  let role = "Usuario";
  if (user && user.role === "admin") {
    role = "Admin";
  }
  console.log("Renderizando la vista de productos con el usuario y el rol:", user, role);
  res.render("realTimeProducts", { user, role });
});

app.get("/products/:pid", isLoggedIn, async (req, res) => {
  res.render("productDetails");
});

app.get("/carts/:cid", isLoggedIn, async (req, res) => {
  res.render("cartDetails");
});

app.get("/home", isLoggedIn, (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  console.log("Renderizando la vista de inicio de sesión");
  res.render("login/login", { registerLink: "/register" });
});

// Ruta para el registro de usuarios
app.get("/register", (req, res) => {
  console.log("Renderizando la vista de registro");
  res.render("register");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/realtimeproducts",
  failureRedirect: "/login",
}));

app.get("/auth/github", passport.authenticate("github"));
app.get("/auth/github/callback", passport.authenticate("github", {
  successRedirect: "/products",
  failureRedirect: "/login",
}));

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

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    const user = req.user;
    if (user && user.role === "admin") {
      return next();
    } else {
      return res.redirect("/products"); // Redirige a /products si el usuario no es admin
    }
  }
  console.log("Usuario no autenticado. Redirigiendo a /login");
  res.redirect("/login"); // Redirige a /login si no está autenticado
}

app.use((err, req, res, next) => {
  console.error("Error interno:", err.stack);
  res.status(500).send("Algo ha salido mal.");
});

const port = 8081;
const host = "0.0.0.0";

server.listen(port, host, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
