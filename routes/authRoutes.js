const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rutas para recuperación de contraseña
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authController.postForgotPassword);
router.get("/reset-password/:token", authController.getResetPassword);
router.post("/reset-password/:token", authController.postResetPassword);

// Rutas para cambiar el rol de usuario
router.get("/change-role/:uid", authController.getChangeRole);
router.post("/change-role/:uid", authController.postChangeRole);

router.get("/login", authController.getLogin);
router.get("/register", authController.getRegister);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

module.exports = router;
