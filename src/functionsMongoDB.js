async function registerUser(userData,client) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      const database = client.db('SCN'); // Cambia esto al nombre de tu base de datos
      const usersCollection = database.collection('users');
  
      // Insertar el nuevo usuario en la colección de usuarios
      await usersCollection.insertOne(userData);
    } finally {
      // Cerrar la conexión a la base de datos
      await client.close();
    }
  }