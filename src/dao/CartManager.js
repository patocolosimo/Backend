const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  id: String,
  products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
});

const Cart = mongoose.model("Cart", cartSchema);

class CartManager {
  constructor() {}

  async createCart() {
    const newCart = new Cart({
      id: this.generateUniqueCartId(),
      products: [],
    });

    await newCart.save();

    return newCart.id;
  }

  async getCart(cartId) {
    try {
      const cart = await Cart.findOne({ id: cartId }).populate('products.product');
      return cart;
    } catch (error) {
      return null;
    }
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find().populate('products.product');
      return carts;
    } catch (error) {
      return [];
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCart(cartId);

      if (cart) {
        const existingProduct = cart.products.find(
          (product) => product.product._id.equals(productId)
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await this.getCart(cartId);

      if (cart) {
        cart.products = updatedProducts.map(product => ({ product: product.productId, quantity: product.quantity }));

        await cart.save();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.getCart(cartId);

      if (cart) {
        const existingProduct = cart.products.find(
          (product) => product.product._id.equals(productId)
        );

        if (existingProduct) {
          existingProduct.quantity = quantity;
          await cart.save();
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCart(cartId);

      if (cart) {
        cart.products = cart.products.filter(
          (product) => !product.product._id.equals(productId)
        );

        await cart.save();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await this.getCart(cartId);

      if (cart) {
        cart.products = [];
        await cart.save();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  generateUniqueCartId() {
    return new Date().getTime().toString();
  }
}

module.exports = CartManager;
