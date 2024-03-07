const express = require('express');
const router = express.Router();
const User = require('../src/dao/models/user');

// Ruta para cambiar el rol de un usuario
router.put('/premium/:uid', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        user.role = (user.role === 'user') ? 'premium' : 'user';
        await user.save();
        res.status(200).json({ message: 'Rol de usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
