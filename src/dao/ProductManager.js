const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  logo: String,
  code: String,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

class ProductManager {
  constructor() {}

  async addProduct(title, description, price, logo, code, stock) {
    const newProduct = new Product({
      title,
      description,
      price,
      logo,
      code,
      stock,
    });

    await newProduct.save();

    return newProduct.id;
  }
  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const result = await Product.findByIdAndUpdate(id, updatedProduct);
      return result !== null;
    } catch (error) {
      return false;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      return false;
    }
  }
}

module.exports = ProductManager;
