const express = require('express');
const router = express.Router();
const ProductManager = require('../src/dao/ProductManager');
const logger = require('../logger');

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: An array of products
 */
router.get('/', async (req, res) => {
  try {
    const products = await ProductManager.getAllProducts();
    res.json(products);
  } catch (error) {
    logger.error("Error getting products:", error);
    res.status(500).send("Something went wrong.");
  }
});

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get details of a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the product
 *       404:
 *         description: Product not found
 */
router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  // Retrieve product details from ProductManager
  try {
    const productDetails = await ProductManager.getProductDetails(productId);
    if (productDetails) {
      res.json(productDetails);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    logger.error("Error getting product details:", error);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
