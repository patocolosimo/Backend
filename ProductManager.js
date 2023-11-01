const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.getProducts();
  }

  addProduct(title, description, price, logo, code, stock) {
    const newProduct = {
      title,
      description,
      price,
      logo,
      code,
      stock,
    };
    newProduct.id = this.products.length + 1;

    this.products.push(newProduct);
    this.saveProducts();

    return newProduct.id;
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    return product;
  }

  updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct };
      this.saveProducts();
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }
}

const productos = new ProductManager('products.json');

console.log(productos.getProducts());
const product = productos.getProductById(1);
console.log("Producto encontrado por ID:", product);
