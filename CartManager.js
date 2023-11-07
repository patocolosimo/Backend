const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.getCarts();
  }

  createCart() {
    const newCart = {
      id: this.generateUniqueCartId(),
      products: [],
    };

    this.carts.push(newCart);
    this.saveCarts();

    return newCart.id;
  }

  getCart(cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    return cart;
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.getCart(cartId);

    if (cart) {
      const existingProduct = cart.products.find((product) => product.productId === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      this.saveCarts();
      return true;
    } else {
      return false;
    }
  }

  saveCarts() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
  }

  getCarts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  generateUniqueCartId() {
    // Genera un ID único basado en la fecha actual en milisegundos
    return new Date().getTime().toString();
  }
}

module.exports = CartManager;
