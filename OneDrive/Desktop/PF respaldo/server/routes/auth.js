// PF/server/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db'); 

// RUTA POST: /api/login
router.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    
    // Consulta simple para verificar usuario y contraseña
    const sql = `SELECT * FROM Usuarios WHERE usuario = ? AND password = ?`;

    db.get(sql, [usuario, password], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        
        if (!user) {
            // Usuario o contraseña incorrectos
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        // Éxito en la autenticación
        res.status(200).json({ message: 'Login exitoso', rol: user.rol });
    });
});

module.exports = router;