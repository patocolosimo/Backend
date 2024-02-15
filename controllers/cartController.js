const CartManager = require("../src/dao/CartManager");
const ProductManager = require("../src/dao/ProductManager");
const TicketService = require("../src/services/TicketService");

const cartManager = new CartManager();
const productManager = new ProductManager();
const ticketService = new TicketService();

// Renderiza la vista de detalles del carrito
exports.getCartDetails = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.render("cartDetails", { cart });
};

// Crea un nuevo carrito y emite una actualización a los clientes
exports.createCart = async (req, res) => {
    const cartId = await cartManager.createCart();
    io.emit("updateCarts", await cartManager.getCarts());
    res.json({ cartId });
};

// Finaliza el proceso de compra del carrito
exports.purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    const products = cart.products;

    const productsNotPurchased = [];

    // Verificar disponibilidad de stock y procesar la compra de cada producto en el carrito
    for (const product of products) {
        const productInfo = await productManager.getProductById(product.productId);

        if (productInfo.stock >= product.quantity) {
            // Restar el stock del producto y continuar con la compra
            await productManager.updateProductStock(product.productId, productInfo.stock - product.quantity);
            // Generar ticket para el producto comprado
            await ticketService.generateTicket(cartId, product.productId, product.quantity);
        } else {
            // Agregar el producto al arreglo de productos no comprados
            productsNotPurchased.push(product.productId);
        }
    }

    // Filtrar los productos que no pudieron comprarse y actualizar el carrito
    const remainingProducts = products.filter(product => !productsNotPurchased.includes(product.productId));
    await cartManager.updateCartProducts(cartId, remainingProducts);

    // Si existen productos no comprados, devolver sus IDs
    if (productsNotPurchased.length > 0) {
        res.status(400).json({ productsNotPurchased });
    } else {
        res.json({ message: "Compra completada exitosamente" });
    }
};
