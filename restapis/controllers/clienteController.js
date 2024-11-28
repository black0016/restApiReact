import Clientes from "../models/Clientes.js"; // Importar el modelo de Clientes de la base de datos

// Crea un nuevo cliente en la base de datos
const nuevoCliente = async (req, res, next) => {
    // Crear un cliente con los datos del body
    const cliente = new Clientes(req.body);
    try {
        // Guardar el cliente en la base de datos
        await cliente.save();
        // Enviar una respuesta al cliente con el código 201 (creado) y el cliente creado
        res.status(201).json({ mensaje: 'Se agrego un nuevo cliente', cliente });
    } catch (error) {
        // Enviar una respuesta al cliente con el código 400 (error) y el mensaje de error
        res.send(error);
        // Llamar al siguiente middleware
        next();
    }
}

// Muestra todos los clientes de la base de datos
const mostrarClientes = async (req, res, next) => {
    try {
        // Buscar todos los clientes en la base de datos
        const clientes = await Clientes.find({});
        // Enviar una respuesta al cliente con el código 200 (ok) y los clientes encontrados
        res.status(200).json(clientes);
    } catch (error) {
        // Enviar una respuesta al cliente con el código 400 (error) y el mensaje de error
        res.status(400).send(error);
        // Llamar al siguiente middleware
        next();
    }
}

// Muestra un cliente por su id de la base de datos
const mostrarCliente = async (req, res, next) => {
    // Buscar un cliente por su id en la base de datos
    const cliente = await Clientes.findById(req.params.idCliente);

    // Si el cliente no existe
    if (!cliente) {
        // Enviar una respuesta al cliente con el código 404 (no encontrado) y el mensaje de error
        res.status(404).json({ mensaje: 'Cliente no encontrado' });
        return next();
    }

    // Enviar una respuesta al cliente con el código 200 (ok) y el cliente encontrado
    res.status(200).json(cliente);
}

// Actualiza un cliente por su id de la base de datos
const actualizarCliente = async (req, res, next) => {
    try {
        // Buscar un cliente por su id en la base de datos y actualizarlo con los datos del body
        const cliente = await Clientes.findOneAndUpdate({ _id: req.params.idCliente }, req.body, {
            new: true
        });
        // Enviar una respuesta al cliente con el código 200 (ok) y el cliente actualizado
        res.status(200).json({cliente});
    } catch (error) {
        // Enviar una respuesta al cliente con el código 400 (error) y el mensaje de error
        res.send(error);
        // Llamar al siguiente middleware
        next();
    }
}

// Elimina un cliente por su id de la base de datos
const eliminarCliente = async (req, res, next) => {
    try {
        // Buscar un cliente por su id en la base de datos y eliminarlo
        await Clientes.findOneAndDelete({ _id: req.params.idCliente });
        // Enviar una respuesta al cliente con el código 200 (ok) y el mensaje de éxito
        res.status(200).json({ mensaje: 'Cliente eliminado' });
    } catch (error) {
        // Enviar una respuesta al cliente con el código 400 (error) y el mensaje de error
        res.send(error);
        // Llamar al siguiente middleware
        next();
    }
}

export {
    nuevoCliente,                            // Exportar la función nuevoCliente para crear un nuevo cliente
    mostrarClientes,                         // Exportar la función mostrarClientes para mostrar todos los clientes
    mostrarCliente,                          // Exportar la función mostrarCliente para mostrar un cliente por su id
    actualizarCliente,                       // Exportar la función actualizarCliente para actualizar un cliente por su id
    eliminarCliente,                         // Exportar la función eliminarCliente para eliminar un cliente por su id
}