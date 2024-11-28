import Usuarios from '../models/Usuarios.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const registrarUsuario = async (req, res) => {
    // Crea una nueva instancia del modelo Usuarios con los datos del cuerpo de la solicitud
    const usuario = new Usuarios(req.body);
    // Hashea la contraseña proporcionada antes de guardarla en la base de datos
    usuario.password = await bcrypt.hash(req.body.password, 12);
    try {
        // Intenta guardar el nuevo usuario en la base de datos
        await usuario.save();
        // Si se guarda correctamente, envía una respuesta con un mensaje de éxito
        res.json({ mensaje: 'Usuario creado correctamente' });
    } catch (error) {
        // Si ocurre un error, lo registra en la consola
        console.log('error', error);
        // Envía una respuesta con un mensaje de error
        res.json({ mensaje: 'Hubo un error' });
    }
}

const autenticarUsuario = async (req, res, next) => {
    const { email, password } = req.body; // Extrae el email y la contraseña del cuerpo de la solicitud
    const usuario = await Usuarios.findOne({ email }); // Busca un usuario en la base de datos por su email
    if (!usuario) { // Si el usuario no existe
        await res.status(401).json({ mensaje: 'Usuario no existe' }); // Envía una respuesta de error 401 (No autorizado)
        return next(); // Llama a la siguiente función middleware
    } else {
        if (!bcrypt.compareSync(password, usuario.password)) { // Compara la contraseña proporcionada con la almacenada en la base de datos
            await res.status(401).json({ mensaje: 'Contraseña incorrecta' }); // Envía una respuesta de error 401 (No autorizado)
            return next(); // Llama a la siguiente función middleware
        } else {
            // Si las credenciales son correctas, genera un token JWT
            const token = jwt.sign({
                email: usuario.email, // Incluye el email del usuario en el token
                nombre: usuario.nombre, // Incluye el nombre del usuario en el token
                id: usuario._id // Incluye el ID del usuario en el token
            }, 'LLAVESECRETA', { // Llave secreta para firmar el token
                expiresIn: '1h' // El token expira en 1 hora
            });
            res.json({ token }); // Envía el token como respuesta
        }
    }
}

export {
    registrarUsuario,
    autenticarUsuario,
}