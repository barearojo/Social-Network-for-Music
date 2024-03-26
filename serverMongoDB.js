//PREGUTAR AL PROFESOR ESTAS COSAS Y PORQUE NO PUTO VAN

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path'); // Importar el módulo 'path' de Node.js

const app = express();
const port = 4000;

// Middleware para analizar los cuerpos de las solicitudes entrantes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Establecer la ruta para servir archivos estáticos desde la carpeta 'src'
app.use(express.static(path.join(__dirname, 'src')));

// URL de conexión a la base de datos MongoDB
const uri = 'mongodb://localhost:27017';

// Nombre de la base de datos
const dbName = 'SCN';

// Ruta para manejar las solicitudes de registro
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Conectar al cliente de MongoDB
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected successfully to server");

        // Seleccionar la base de datos
        const db = client.db(dbName);

        // Obtener la colección de usuarios
        const usersCollection = db.collection('user'); // Cambiado a 'user' en lugar de 'users'

        // Insertar el nuevo usuario en la colección
        await usersCollection.insertOne({ username, password });

        // Cerrar la conexión con el cliente de MongoDB
        client.close();

        // Respuesta exitosa
        res.status(200).send('Signup successful');
    } catch (err) {
        console.log(err);
        // Manejar errores durante el proceso de registro
        res.status(500).send('Error during signup');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
