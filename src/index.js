const http = require('http'); // Importa el módulo http de Node.js

const server = http.createServer((request, response) => {
    const { method, url } = request; // Obtén el método de solicitud y la URL
    if (method === 'GET' && url === '/') {
        // Si la solicitud es un método GET y la URL es '/', responde con la página de inicio
        response.writeHead(200, { 'Content-Type': 'text/html' }); // Configura el encabezado de respuesta
        response.end('<h1>Welcome to the homepage</h1>'); // Envía la respuesta
    } else if (method === 'GET' && url === '/signup') {
        // Si la solicitud es un método GET y la URL es '/signup', responde con la página de registro
        response.writeHead(200, { 'Content-Type': 'text/html' }); // Configura el encabezado de respuesta
        response.end('<h1>Welcome to the signup page</h1>'); // Envía la respuesta
    } else {
        // Si la solicitud no coincide con ninguna ruta definida, responde con un 404
        response.writeHead(404, { 'Content-Type': 'text/plain' }); // Configura el encabezado de respuesta
        response.end('404 Not Found'); // Envía la respuesta
    }
});

const PORT = 9050;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

