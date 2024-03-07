// Importar los módulos necesarios
const http = require('http'); // Módulo HTTP de Node.js para crear el servidor
const url = require('url'); // Módulo URL de Node.js para analizar las URLs
const fs = require('fs'); // Módulo File System de Node.js para leer archivos del sistema de archivos
const MongoClient = require('mongodb').MongoClient; // Módulo MongoDB para interactuar con la base de datos

// URL de la base de datos MongoDB y nombre de la base de datos
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'auth_demo';

// Conexión a MongoDB
MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Conectado a la base de datos');

  // Obtiene una instancia de la base de datos
  const db = client.db(dbName);

  // Obtiene una referencia a la colección de usuarios en la base de datos
  const usersCollection = db.collection('users');

  // Crea el servidor HTTP
  http.createServer((req, res) => {
    // Obtiene la ruta y la consulta de la URL solicitada
    const { pathname, query } = url.parse(req.url, true);

    // Maneja la solicitud de registro (signup)
    if (pathname === '/signup' && req.method === 'POST') {
      let body = '';
      // Escucha los datos de la solicitud entrante
      req.on('data', chunk => {
        body += chunk.toString();
      });
      // Se ejecuta cuando se reciben todos los datos de la solicitud
      req.on('end', async () => {
        try {
          // Parsea los datos del cuerpo de la solicitud (username y password)
          const { username, password } = JSON.parse(body);
          // Inserta el nuevo usuario en la colección de usuarios
          await usersCollection.insertOne({ username, password });
          // Responde con un código de estado 201 (Created) y un mensaje de éxito
          res.writeHead(201);
          res.end('User created successfully');
        } catch (error) {
          // Manejo de errores
          console.error('Error signing up:', error);
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      });
    } 
    // Maneja la solicitud de inicio de sesión (login)
    else if (pathname === '/login' && req.method === 'POST') {
      let body = '';
      // Escucha los datos de la solicitud entrante
      req.on('data', chunk => {
        body += chunk.toString();
      });
      // Se ejecuta cuando se reciben todos los datos de la solicitud
      req.on('end', async () => {
        try {
          // Parsea los datos del cuerpo de la solicitud (username y password)
          const { username, password } = JSON.parse(body);
          // Busca al usuario en la base de datos por su nombre de usuario y contraseña
          const user = await usersCollection.findOne({ username, password });
          // Si no se encuentra al usuario, responde con un código de estado 401 (Unauthorized)
          if (!user) {
            res.writeHead(401);
            res.end('Invalid username or password');
            return;
          }
          // Si se encuentra al usuario, responde con un código de estado 200 (OK) y un mensaje de éxito
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Login successful' }));
        } catch (error) {
          // Manejo de errores
          console.error('Error logging in:', error);
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      });
    } 
    // Maneja las demás solicitudes (sirve el archivo HTML para la interfaz de usuario)
    else {
      fs.readFile('index.html', (err, data) => {
        if (err) {
          // Si ocurre un error al leer el archivo, responde con un código de estado 500 (Internal Server Error)
          res.writeHead(500);
          res.end('Internal Server Error');
          return;
        }
        // Responde con un código de estado 200 (OK) y el contenido del archivo HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
    }
  }).listen(3000, () => {
    // Imprime un mensaje en la consola cuando el servidor está listo y escuchando en el puerto 3000
    console.log('Server is running on http://localhost:3000');
  });
});
