const http = require('http');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');

const hostname = '127.0.0.1';
const port = 3000;

const uri = "mongodb+srv://juanbareagarchomp:LHlLK6Vr1fVhKfh8@cluster0.lqh6du8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exiting the process if unable to connect to MongoDB
  }
}

async function closeMongoDBConnection() {
  try {
    await client.close();
    console.log("Closed MongoDB connection.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

async function serveFile(req, res) {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './pages/login.html';
  }

  const extname = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript'
  }[extname] || 'application/octet-stream';

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    console.error("Error reading file:", error);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
}

async function handleSignup(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  try {
    const userData = req.body; // Suponiendo que los datos del usuario están en req.body
    await registerUser(userData);

    // Ejemplo básico de cómo manejar la solicitud de registro
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('User registered successfully');
  } catch (error) {
    console.error("Error handling signup:", error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

async function authenticateUser(username, password) {

  try {
    const database = client.db('SCN'); // Cambia esto al nombre de tu base de datos
    const usersCollection = database.collection('users');

    // Buscar al usuario en la colección de usuarios
    const user = await usersCollection.findOne({ username, password });
    return user;
  } 
  catch (error) {
    console.error("Error haciendo singup:", error);
  }
}

async function handleLogin(req, res) {
  // Verifica si el método de solicitud no es POST
  if (req.method !== 'POST') {
    // Si no es POST, envía una respuesta 405 (Método no permitido)
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed'); // Finaliza la respuesta con un mensaje
    return; // Sale de la función tempranamente
  }

  try {
    // Aquí deberías manejar la lógica para autenticar al usuario en la base de datos
    // Puedes acceder a los datos enviados desde el formulario mediante req.body

    // Desestructura los datos del cuerpo de la solicitud (suponiendo que son username y password)
    const { username, password } = req.body;
    // Autentica al usuario utilizando los datos proporcionados
    const user = await authenticateUser(username, password);

    if (user) {
      // Si el usuario está autenticado con éxito, envía una respuesta 200 (OK)
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('User logged in successfully'); // Finaliza la respuesta con un mensaje
    } else {
      // Si el usuario no está autenticado, envía una respuesta 401 (No autorizado)
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Invalid username or password'); // Finaliza la respuesta con un mensaje
    }
  } catch (error) {
    // Si se produce un error durante el proceso, registra el error y envía una respuesta 500 (Error del servidor)
    console.error("Error handling login:", error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error'); // Finaliza la respuesta con un mensaje
  }
}


async function registerUser(userData) {
  try {
    const database = client.db('SCN'); // Cambia esto al nombre de tu base de datos
    const usersCollection = database.collection('users');

    // Insertar el nuevo usuario en la colección de usuarios
    await usersCollection.insertOne(userData);
    console.log("Se va a añadir un nuevo usuario ", userData);
  }
  catch (error) {
    console.error("Error haciendo singup:", error);
  }
}

async function startServer() {
  await connectToMongoDB();

  const server = http.createServer(async (req, res) => {
    // Parsear el cuerpo de la solicitud como JSON si la solicitud es POST
    if (req.method === 'POST') {
      let data = '';
      req.on('data', chunk => {
        data += chunk.toString();
      });
      req.on('end', async () => {
        req.body = JSON.parse(data);
        if (req.url === '/signup') {
          await handleSignup(req, res);
        } else if (req.url === '/login') {
          await handleLogin(req, res);
        } else {
          await serveFile(req, res);
        }
      });
    } else {
      if (req.url === '/signup') {
        await handleSignup(req, res);
      } else if (req.url === '/login') {
        await handleLogin(req, res);
      } else {
        await serveFile(req, res);
      }
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

startServer().catch(error => {
  console.error("Error starting server:", error);
  process.exit(1); // Exiting the process if unable to start the server
});
