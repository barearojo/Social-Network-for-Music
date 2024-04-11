const http = require('http');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    // Aquí deberías manejar la lógica para registrar al usuario en la base de datos
    // Puedes acceder a los datos enviados desde el formulario mediante req.body

    // Ejemplo básico de cómo manejar la solicitud de registro
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('User registered successfully');
  } catch (error) {
    console.error("Error handling signup:", error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  try {
    // Aquí deberías manejar la lógica para autenticar al usuario en la base de datos
    // Puedes acceder a los datos enviados desde el formulario mediante req.body

    // Ejemplo básico de cómo manejar la solicitud de inicio de sesión
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('User logged in successfully');
  } catch (error) {
    console.error("Error handling login:", error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

async function startServer() {
  await connectToMongoDB();

  const server = http.createServer(async (req, res) => {
    const url = req.url;
    if (url === '/signup') {
      await handleSignup(req, res);
    } else if (url === '/login') {
      await handleLogin(req, res);
    } else {
      await serveFile(req, res);
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
