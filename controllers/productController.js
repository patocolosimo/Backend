const ProductManager = require("../src/dao/ProductManager");

const productos = new ProductManager();

// Renderiza la vista de productos
exports.getProducts = async (req, res) => {
    const user = req.user;
    let role = "Usuario";
    if (user && (user.role === "admin" || user.role === "premium")) { // Se agrega la verificación para usuarios premium
        role = "Admin";
    }
    res.render("realTimeProducts", { user, role });
};

// Renderiza la vista de detalles del producto
exports.getProductDetails = (req, res) => {
    res.render("productDetails");
};

// Controlador para crear un producto
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const owner = req.user.email; // Se asigna el propietario del producto como el correo electrónico del usuario
        const product = await productos.createProduct(name, description, price, owner);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = req.user;
        const product = await productos.getProduct(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (user.role === "admin" || (user.role === "premium" && product.owner === user.email)) {
            await productos.deleteProduct(productId);
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(403).json({ message: "No tienes permisos para eliminar este producto" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
