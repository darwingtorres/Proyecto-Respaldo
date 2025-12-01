// PF/server.js 
const express = require('express');
const path = require('path');
const db = require('./server/db'); 

const app = express();
const PORT = 3000;

// Importa los archivos de rutas
const materiasRouter = require('./server/routes/materias'); 
const lotesRouter = require('./server/routes/lotes');
const authRouter = require('./server/routes/auth');

//  Middleware de Procesamiento JSON, URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Conexión de Rutas de la API 
app.use('/api/materias', materiasRouter); 
app.use('/api/lotes', lotesRouter); 
app.use('/api', authRouter); 


// Archivos Estáticos 
// Maneja peticiones de archivos como /index.html o /js/materias.js
app.use(express.static('public'));

app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Arrancar Servidor 
app.listen(PORT, () => {
    console.log(`Servidor STOPA Lite corriendo en http://localhost:${PORT}`);
});