const express = require("express");
const router = express.Router();
const db = require("../db");

// POST: registrar lote y descontar insumos CON TRANSACCIÓN
router.post("/", (req, res) => {
    const {
        nombre_producto,
        cantidad_producida,
        fecha_produccion,
        insumos_utilizados
    } = req.body;

    if (!nombre_producto || !cantidad_producida || !fecha_produccion) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        //  Registrar el lote
        const sqlInsertLote = `
            INSERT INTO Lotes_Produccion 
            (nombre_producto, cantidad_producida, fecha_produccion)
            VALUES (?, ?, ?)
        `;

        db.run(
            sqlInsertLote,
            [nombre_producto, cantidad_producida, fecha_produccion],
            function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: "Error al registrar lote." });
                }

                const loteID = this.lastID;

                // Si el lote NO usa insumos a terminar
                if (!insumos_utilizados || insumos_utilizados.length === 0) {
                    db.run("COMMIT");
                    return res.status(201).json({
                        message: "Lote registrado sin insumos.",
                        id: loteID
                    });
                }

                //Descontar stock insumo por insumo
                let errores = 0;
                let procesados = 0;

                insumos_utilizados.forEach((insumo) => {
                    const sqlUpdateStock =
                        "UPDATE Materias_Primas SET cantidad_stock = cantidad_stock - ? WHERE id = ?";

                    db.run(
                        sqlUpdateStock,
                        [insumo.cantidad_usada, insumo.id],
                        function (err2) {
                            procesados++;

                            if (err2 || this.changes === 0) {
                                errores++;
                            }

                            if (procesados === insumos_utilizados.length) {
                                if (errores > 0) {
                                    db.run("ROLLBACK");
                                    return res.status(500).json({
                                        error:
                                            "Error al descontar stock. Ningún dato fue guardado."
                                    });
                                }

                                db.run("COMMIT");
                                return res.status(201).json({
                                    message: "Lote registrado y stock actualizado.",
                                    id: loteID
                                });
                            }
                        }
                    );
                });
            }
        );
    });
});

// GET: obtener todos los lotes
router.get("/", (req, res) => {
    const sql = `
        SELECT id, nombre_producto, cantidad_producida, fecha_produccion
        FROM Lotes_Produccion
        ORDER BY fecha_produccion DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// DELETE: eliminar lote
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM Lotes_Produccion WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: "Error al eliminar lote." });
        if (this.changes === 0)
            return res.status(404).json({ error: "Lote no encontrado." });

        res.json({ message: "Lote eliminado correctamente." });
    });
});

module.exports = router;
