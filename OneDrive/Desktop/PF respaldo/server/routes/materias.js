// PF/server/routes/materias.js CÓDIGO DE LA API - BACKEND
const express = require('express');
const router = express.Router();
const db = require('../db'); 

// RUTA POST: /api/materias/ Para agregar nueva materia prima
router.post('/', (req, res) => {
    const { nombre, lote_proveedor, fecha_caducidad, cantidad_stock } = req.body;
    const sql = `INSERT INTO Materias_Primas (nombre, lote_proveedor, fecha_caducidad, cantidad_stock) VALUES (?, ?, ?, ?)`;

    db.run(sql, [nombre, lote_proveedor, fecha_caducidad, cantidad_stock], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error al registrar la materia prima en la base de datos.' });
        }
        res.status(201).json({ 
            message: 'Materia prima registrada con éxito.', 
            id: this.lastID 
        });
    });
});

// RUTA GET: /api/materias/ Para obtener todas las materias primas
router.get('/', (req, res) => {
    const sql = `SELECT * FROM Materias_Primas ORDER BY nombre ASC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error al obtener el inventario.' });
        }
        res.json(rows);
    });
});

// RUTA DELETE Para eliminar materia prima por ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM Materias_Primas WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) {
            console.error("Error al eliminar materia prima:", err.message);
            return res.status(500).json({ error: 'Error al eliminar la materia prima.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Materia prima no encontrada.' });
        }
        res.status(200).json({ message: 'Materia prima eliminada con éxito.', changes: this.changes });
    });
});

module.exports = router;