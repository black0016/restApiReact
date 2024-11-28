import mongoose from "mongoose"; // Importar mongoose para conectarse a la base de datos


const Schema = mongoose.Schema; // Crear un esquema de mongoose


const productoSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
    },
    precio: {
        type: Number,
        default: 0,
    },
    imagen: {
        type: String,
    }
});

// Exportar el modelo de mongoose con el nombre de Productos y el esquema productoSchema
export default mongoose.model('Productos', productoSchema);