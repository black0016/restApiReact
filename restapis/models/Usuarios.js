import mongoose from "mongoose"; // Importa el módulo mongoose para interactuar con MongoDB
import { Schema } from "mongoose"; // Importa el objeto Schema de mongoose para definir la estructura de los documentos


// Define el esquema para el modelo de Usuarios
const UsuariosSchema = new Schema({
    nombre: {
        type: String, // El campo 'nombre' es de tipo String
        required: true, // El campo 'nombre' es obligatorio
        trim: true, // Elimina los espacios en blanco al principio y al final del valor
    },
    email: {
        type: String, // El campo 'email' es de tipo String
        required: true, // El campo 'email' es obligatorio
        trim: true, // Elimina los espacios en blanco al principio y al final del valor
        unique: true, // El campo 'email' debe ser único en la colección
        lowercase: true, // Convierte el valor del campo 'email' a minúsculas
    },
    password: {
        type: String, // El campo 'password' es de tipo String
        required: true, // El campo 'password' es obligatorio
        trim: true, // Elimina los espacios en blanco al principio y al final del valor
    }
});

// Exporta el modelo 'Usuarios' basado en el esquema 'UsuariosSchema'
export default mongoose.model('Usuarios', UsuariosSchema);