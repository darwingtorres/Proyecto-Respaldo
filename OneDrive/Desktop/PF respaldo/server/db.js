// PF/server/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// La base de datos se guardará en un archivo llamado 'stopa.db'
const DB_PATH = path.join(__dirname, '..', 'stopa.db'); 
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a la Base de Datos SQLite.');
        createTables(); 
    }
});

// FUNCIÓN PARA CREAR LAS TABLAS SI NO EXISTEN
function createTables() {
    // 1. Materias Primas 
    db.run(`CREATE TABLE IF NOT EXISTS Materias_Primas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        lote_proveedor TEXT,
        fecha_caducidad TEXT,
        cantidad_stock REAL
    )`);

    // 2. Lotes de Producción Producto Final
   db.run(`CREATE TABLE IF NOT EXISTS Lotes_Produccion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_producto TEXT NOT NULL,
    cantidad_producida REAL NOT NULL,
    fecha_produccion DATE NOT NULL
    )`);

    // 3. Tabla de Relación Trazabilidad
    db.run(`CREATE TABLE IF NOT EXISTS Receta_Lote (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lote_id INTEGER,
        materia_prima_id INTEGER,
        cantidad_usada REAL,
        FOREIGN KEY (lote_id) REFERENCES Lotes_Produccion(id),
        FOREIGN KEY (materia_prima_id) REFERENCES Materias_Primas(id)
    )`);

    console.log('Tablas verificadas/creadas.');
    // PF/server/db.js Agregar dentro de la función de creación de tablas

// Tabla de Usuarios
db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'operador'
);`);

// Opcional: Insertar un usuario por defecto si la tabla está vacía
db.get("SELECT COUNT(*) AS count FROM Usuarios", (err, row) => {
    if (row.count === 0) {
        // La contraseña 'admin' 
        db.run(`INSERT INTO Usuarios (usuario, password, rol) VALUES (?, ?, ?)`, 
            ['admin', 'admin123', 'admin'],
            (err) => {
                if (err) console.error("Error al insertar usuario por defecto:", err.message);
                else console.log("Usuario 'admin' insertado.");
            }
        );
    }
});
}

module.exports = db;