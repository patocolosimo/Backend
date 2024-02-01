const ProductManager = require("../src/dao/ProductManager");

const productos = new ProductManager();

// Renderiza la vista de productos
exports.getProducts = async (req, res) => {
    const user = req.user;
    let role = "Usuario";
    if (user && user.role === "admin") {
        role = "Admin";
    }
    res.render("realTimeProducts", { user, role });
};

// Renderiza la vista de detalles del producto
exports.getProductDetails = (req, res) => {
    res.render("productDetails");
};
