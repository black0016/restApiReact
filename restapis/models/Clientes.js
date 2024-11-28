import mongoose from "mongoose"; // Importar mongoose para conectarse a la base de datos


const Schema = mongoose.Schema; // Crear un esquema de mongoose


const clienteSchema = new Schema({
    nombre: {
        type: String, // Tipo de dato
        trim: true // Eliminar espacios en blanco
    },
    apellido: {
        type: String, // Tipo de dato
        trim: true // Eliminar espacios en blanco
    },
    empresa: {
        type: String, // Tipo de dato
        trim: true // Eliminar espacios en blanco
    },
    email: {
        type: String, // Tipo de dato
        unique: true, // Campo único
        lowercase: true, // Convertir a minúsculas
        trim: true // Eliminar espacios en blanco
    },
    telefono: {
        type: String, // Tipo de dato
        trim: true // Eliminar espacios en blanco
    }
});

// Exportar el modelo de mongoose con el nombre de Clientes y el esquema clienteSchema
export default mongoose.model('Clientes', clienteSchema);