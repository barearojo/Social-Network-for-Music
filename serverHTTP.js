// Importación de módulos necesarios
const http = require('http'); // Módulo para crear el servidor HTTP
const fs = require('fs'); // Módulo para interactuar con el sistema de archivos
const path = require('path'); // Módulo para manejar rutas de archivos
const moment = require('moment'); // Importar la biblioteca moment.js para manipulación de fechas y horas

// Definición del hostname y puerto del servidor
const hostname = '127.0.0.1';
const port = 3000;

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
    // Obtener la ruta del archivo solicitado
    let filePath = '.' + req.url;
    if (filePath === './') {
        // Si la ruta es la raíz, servir la página de login.html
        filePath = './pages/login.html';
    }

    // Obtener la extensión del archivo solicitado
    const extname = path.extname(filePath);

    // Definir el tipo de contenido basado en la extensión del archivo
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript'
    }[extname] || 'application/octet-stream';

    // Leer el archivo correspondiente
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Si hay un error al leer el archivo, devolver un error 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        } else {
            // Si se encuentra el archivo, devolver su contenido con el tipo de contenido adecuado
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Iniciar el servidor y escuchar en el puerto y hostname especificados
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

