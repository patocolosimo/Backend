const express = require("express");
const router = express.Router();
const { isLoggedIn } = require('../App');
const cartController = require("../controllers/cartController");

router.get("/carts/:cid", isLoggedIn, cartController.getCartDetails);
router.post("/api/carts", isLoggedIn, cartController.createCart);

module.exports = router;
