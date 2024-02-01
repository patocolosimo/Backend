const CartManager = require("../src/dao/CartManager");
const carritos = new CartManager();

// Renderiza la vista de detalles del carrito
exports.getCartDetails = (req, res) => {
    res.render("cartDetails");
};

// Crea un nuevo carrito y emite una actualización a los clientes
exports.createCart = async (req, res) => {
    const cartId = await carritos.createCart();
    io.emit("updateCarts", await carritos.getCarts());
    res.json({ cartId });
};
