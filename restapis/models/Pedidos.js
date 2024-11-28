import mongoose from "mongoose"; // Importar mongoose para conectarse a la base de datos


const Schema = mongoose.Schema; // Crear un esquema de mongoose


// Definición del esquema de pedidos
const pedidosSchema = new Schema({
    // Referencia al cliente que realizó el pedido
    cliente: {
        type: Schema.ObjectId, // Tipo de dato es ObjectId
        ref: 'Clientes', // Referencia al modelo 'Clientes'
    },
    // Lista de productos en el pedido
    pedido : [{
        // Referencia al producto específico
        producto: {
            type: Schema.ObjectId, // Tipo de dato es ObjectId
            ref: 'Productos', // Referencia al modelo 'Productos'
        },
        cantidad: Number, // Cantidad del producto en el pedido
    }],
    // Total del pedido
    total: {
        type: Number, // Tipo de dato es Número
    }
});

export default mongoose.model('Pedidos', pedidosSchema); // Exportar el modelo de mongoose con el nombre de Pedidos y el esquema pedidosSchema