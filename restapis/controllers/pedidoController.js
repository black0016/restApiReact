import mongoose from "mongoose"; // Importar mongoose para validar el ObjectId
import Pedidos from "../models/Pedidos.js"; // Importar el modelo Pedidos para interactuar con la base de datos

// Función para crear un nuevo pedido en la base de datos
const nuevoPedido = async (req, res) => {
    const pedido = new Pedidos(req.body); // Crear un nuevo pedido con los datos del body
    try {
        // Guardar el pedido en la base de datos
        await pedido.save();
        // Responder al cliente con un mensaje
        res.json({ mensaje: 'Se agregó un nuevo pedido' });
    } catch (error) {
        console.log('error', error);
        next();
    }
}

// Función para mostrar todos los pedidos en la base de datos 
const mostrarPedidos = async (req, res) => {
    try {
        // Consultar todos los pedidos en la base de datos
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        // Responder al cliente con los pedidos
        res.json(pedidos);
    } catch (error) {
        console.log('error', error);
        next();
    }
}

// Función para mostrar un pedido por su id en la base de datos
const mostrarPedido = async (req, res) => {
    try {
        // Obtener el id del pedido de los parámetros de la URL
        const { idPedido } = req.params;

        // Validar si el id del pedido es un ObjectId de mongoose
        if (!mongoose.Types.ObjectId.isValid(idPedido)) {
            res.json({ mensaje: 'El ID del pedido no es válido' });
            return next();
        }

        // Consultar un pedido por su id en la base de datos
        const pedido = await Pedidos.findById(idPedido).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });

        // Validar si el pedido existe
        if (!pedido) {
            res.json({ mensaje: 'El pedido no existe' });
            return next();
        }

        // Responder al cliente con el pedido
        res.json(pedido);
    } catch (error) {
        console.log('error', error);
        next();
    }
}

// Función para actualizar un pedido por su id en la base de datos
const actualizarPedido = async (req, res, next) => {
    try {
        // Obtener el id del pedido de los parámetros de la URL
        const { idPedido } = req.params;

        // Validar si el id del pedido es un ObjectId de mongoose
        if (!mongoose.Types.ObjectId.isValid(idPedido)) {
            res.json({ mensaje: 'El ID del pedido no es válido' });
            return next();
        }

        // Actualizar un pedido por su id en la base de datos
        const pedido = await Pedidos.findOneAndUpdate({ _id: idPedido }, req.body, { new: true }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });

        // Responder al cliente con el pedido actualizado
        res.json(pedido);
    } catch (error) {
        console.log('error', error);
        next();
    }
}

// Función para eliminar un pedido por su id en la base de datos
const eliminarPedido = async (req, res, next) => {
    try {
        // Obtener el id del pedido de los parámetros de la URL
        const { idPedido } = req.params;

        // Validar si el id del pedido es un ObjectId de mongoose
        if (!mongoose.Types.ObjectId.isValid(idPedido)) {
            res.json({ mensaje: 'El ID del pedido no es válido' });
            return next();
        }

        // Eliminar un pedido por su id en la base de datos
        await Pedidos.findOneAndDelete({ _id: idPedido });

        // Responder al cliente con un mensaje
        res.json({ mensaje: 'El pedido fue eliminado' });
    } catch (error) {
        console.log('error', error);
        next();
    }
}


export {
    nuevoPedido, // Exportar la función nuevoPedido para crear un nuevo pedido
    mostrarPedidos, // Exportar la función mostrarPedidos para mostrar todos los pedidos
    mostrarPedido, // Exportar la función mostrarPedido para mostrar un pedido por su id
    actualizarPedido, // Exportar la función actualizarPedido para actualizar un pedido por su id
    eliminarPedido // Exportar la función eliminarPedido para eliminar un pedido por su id
}