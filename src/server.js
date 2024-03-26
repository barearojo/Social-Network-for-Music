// Importación de módulos necesarios
const http = require('http'); // Módulo para crear el servidor HTTP
const fs = require('fs'); // Módulo para interactuar con el sistema de archivos
const path = require('path'); // Módulo para manejar rutas de archivos
const moment = require('moment'); // Importar la biblioteca moment.js para manipulación de fechas y horas

// Definición del hostname y puerto del servidor
const hostname = '127.0.0.1';
const port = 3000;

// Creación del servidor HTTP
const server = http.createServer((req, res) => {
  // Obtiene la URL solicitada por el navegador
  const url = req.url;

  // Si la URL es raíz, sirve home.html como página de inicio
  if (url === '/') {
    serveHomePage(res);
    return;
  }

  // Determina el nombre del archivo correspondiente
  let filePath = path.join(__dirname, url);

  // Verifica si el archivo solicitado existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si el archivo no existe, devuelve un error 404
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('404 Not Found');
      return;
    }

    // Si el archivo existe, lo sirve
    serveFile(filePath, res);
  });
});

// Función para servir la página de inicio
function serveHomePage(res) {
  const homeFilePath = path.join(__dirname, 'home.html');
  serveFile(homeFilePath, res);
}

// Función para servir archivos
function serveFile(filePath, res) {
  // Lee el archivo y envíalo como respuesta
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Si hay un error al leer el archivo, devuelve un error 500
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('500 Internal Server Error');
      return;
    }

    // Determina el tipo MIME basado en la extensión del archivo
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') {
      contentType = 'text/css';
    } else if (ext === '.js') {
      contentType = 'application/javascript';
    }

    // Configura la respuesta con el contenido y tipo MIME adecuados
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

// Inicia el servidor y escucha en el puerto especificado
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


