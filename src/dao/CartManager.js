const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  id: String,
  products: [{ productId: String, quantity: Number }],
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
      const cart = await Cart.findOne({ id: cartId });
      return cart;
    } catch (error) {
      return null;
    }
  }

  // Método para agregar un producto a un carrito
  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCart(cartId);

      if (cart) {
        const existingProduct = cart.products.find(
          (product) => product.productId === productId
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }

        // Guarda el carrito actualizado en la base de datos
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
    // Genera un ID único basado en la fecha actual en milisegundos
    return new Date().getTime().toString();
  }
}

module.exports = CartManager;
