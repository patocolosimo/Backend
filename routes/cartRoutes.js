const express = require('express');
const router = express.Router();
const CartManager = require('../src/dao/CartManager');
const logger = require('../logger');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operations related to shopping carts
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new shopping cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: A new cart ID
 */
router.post('/', async (req, res) => {
  try {
    const cartId = await CartManager.createCart();
    res.json({ cartId });
  } catch (error) {
    logger.error("Error creating cart:", error);
    res.status(500).send("Something went wrong.");
  }
});

/**
 * @swagger
 * /api/carts/{cartId}:
 *   get:
 *     summary: Get details of a shopping cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: ID of the shopping cart to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the shopping cart
 *       404:
 *         description: Cart not found
 */
router.get('/:cartId', async (req, res) => {
  const cartId = req.params.cartId;
  // Retrieve cart details from CartManager
  try {
    const cartDetails = await CartManager.getCartDetails(cartId);
    if (cartDetails) {
      res.json(cartDetails);
    } else {
      res.status(404).send("Cart not found");
    }
  } catch (error) {
    logger.error("Error getting cart details:", error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
