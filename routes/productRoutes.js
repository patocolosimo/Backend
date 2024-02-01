const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../App");
const productController = require("../controllers/productController");

router.get("/products", isLoggedIn, productController.getProducts);
router.get("/products/:pid", isLoggedIn, productController.getProductDetails);

module.exports = router;
