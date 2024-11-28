import express from 'express'; // Importar express
import mongoose from 'mongoose'; // Importar mongoose

import routes from './routes/index.js'; // Importar el archivo de rutas

// Importa el middleware 'cors' para habilitar CORS (Cross-Origin Resource Sharing) en la aplicación.
// CORS permite que un servidor indique cualquier otro origen (dominio, esquema o puerto) desde el cual un navegador debe permitir la carga de recursos.
// Esto es útil para permitir que la API sea accesible desde diferentes dominios.
import cors from 'cors';


// Conectar a la base de datos de MongoDB
mongoose.Promise = global.Promise; // Usar las promesas globales de Node.js
mongoose.connect('mongodb://localhost:27017/restapis'); // Conectar a la base de datos restapis en localhost en el puerto 27017 


// Crear un servidor express
const app = express();


// Habilitar express.json
app.use(express.json());
// Habilitar express.urlencoded
app.use(express.urlencoded({ extended: true }));


// Habilitar cors en la aplicación
app.use(cors());


// Usar las rutas del archivo de rutas
app.use('/', routes);


// Configura la aplicación para servir archivos estáticos desde el directorio 'uploads'.
// Esto permite que los archivos en el directorio 'uploads' sean accesibles públicamente a través de la URL base de la aplicación.
app.use(express.static('uploads'));


// Iniciar el servidor en el puerto 5004
app.listen(5004, () => {
    console.log('Server is running on http://localhost:5004');
});