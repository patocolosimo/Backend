const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../src/dao/models/user");

// Renderiza la vista de inicio de sesión
exports.getLogin = (req, res) => {
    res.render("login/login", { registerLink: "/register" });
};

// Renderiza la vista de registro
exports.getRegister = (req, res) => {
    res.render("register");
};

// Maneja el inicio de sesión
exports.postLogin = passport.authenticate("local", {
    successRedirect: "/realtimeproducts",
    failureRedirect: "/login",
});

// Cierra la sesión del usuario
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/login");
};
