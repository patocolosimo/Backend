const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  logo: String,
  code: String,
  stock: Number,
  category: String,
  availability: Boolean,
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

  async getProducts(options) {
    const { limit = 10, page = 1, sort, query } = options;

    try {
      const searchQuery = query ? { ...query } : {};
      const sortOption = sort === "desc" ? { price: -1 } : { price: 1 };

      const products = await Product.find(searchQuery)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalProducts = await Product.countDocuments(searchQuery);

      return {
        status: "success",
        payload: {
          docs: products,
          total: totalProducts,
        },
        totalPages: Math.ceil(totalProducts / limit),
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < Math.ceil(totalProducts / limit) ? page + 1 : null,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < Math.ceil(totalProducts / limit),
        prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${JSON.stringify(query)}` : null,
        nextLink: page < Math.ceil(totalProducts / limit) ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${JSON.stringify(query)}` : null,
      };
    } catch (error) {
      return { status: "error", payload: { docs: [], total: 0 } };
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
      const result = await Product.findByIdAndUpdate(id, updatedProduct, {
        new: true,
      });
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

