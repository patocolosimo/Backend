const express = require("express");8081
const fs = require("fs");
const logger = require("./logger"); // Importar el módulo de logging
const app = express();
const port = 8081;

app.use(express.json());

const productsRouter = express.Router();
app.use("/api/products", productsRouter);

productsRouter.get("/", (req, res) => {
  const { limit } = req.query;
  const products = loadProducts();

  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit, 10));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

productsRouter.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = findProduct(pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;
  const products = loadProducts();

  newProduct.id = generateUniqueId(products);
  products.push(newProduct);

  saveProducts(products);
  res.status(201).json(newProduct);
});

productsRouter.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updatedProductData = req.body;
  const products = loadProducts();

  const productIndex = products.findIndex((product) => product.id === pid);

  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...updatedProductData };
    products[productIndex] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

productsRouter.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  const products = loadProducts();
  const filteredProducts = products.filter((product) => product.id !== pid);

  if (filteredProducts.length < products.length) {
    saveProducts(filteredProducts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

const cartsRouter = express.Router();
app.use("/api/carts", cartsRouter);

cartsRouter.post("/", (req, res) => {
  const newCart = {
    id: generateUniqueId([]), // Asegura IDs únicos
    products: [],
  };
  saveCart(newCart);
  res.status(201).json(newCart);
});

cartsRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = loadCart(cid);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = loadCart(cid);
  const products = loadProducts();

  const productToAdd = findProduct(pid);

  if (!productToAdd) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  let productInCart = cart.products.find((p) => p.id === pid);

  if (!productInCart) {
    productInCart = {
      id: pid,
      quantity: 0,
    };
    cart.products.push(productInCart);
  }

  productInCart.quantity += parseInt(quantity, 10);
  saveCart(cart);
  res.status(201).json(cart);
});

function loadProducts() {
  try {
    const data = fs.readFileSync("products.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveProducts(products) {
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
}

function findProduct(id) {
  const products = loadProducts();
  return products.find((product) => product.id === id);
}

function generateUniqueId(existingItems) {
  let id;
  do {
    id = Math.floor(Math.random() * 10000).toString();
  } while (existingItems.some((item) => item.id === id));
  return id;
}

function loadCart(cid) {
  try {
    const data = fs.readFileSync("cart.json", "utf8");
    const carts = JSON.parse(data);
    return carts.find((cart) => cart.id === cid);
  } catch (error) {
    return null;
  }
}

function saveCart(cart) {
  let carts = [];
  try {
    const data = fs.readFileSync("cart.json", "utf8");
    carts = JSON.parse(data);
  } catch (error) {
    // El archivo no existe, se creará uno nuevo
  }
  carts.push(cart);
  fs.writeFileSync("cart.json", JSON.stringify(carts, null, 2));
}

app.listen(port, () => {
  logger.info(`Servidor Express escuchando en el puerto ${port}`); // Usar el logger para información
});
