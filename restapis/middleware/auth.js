import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    // Obtiene el encabezado de autorización de la solicitud
    const authHeader = req.get('Authorization');

    // Si no hay encabezado de autorización, lanza un error
    if (!authHeader) {
        const error = new Error('No autenticado, no hay JWT');
        error.statusCode = 401; // Código de estado 401 (No autorizado)
        throw error; // Lanza el error para ser manejado por el middleware de errores
    }

    // Divide el encabezado de autorización para obtener el token
    const token = authHeader.split(' ')[1];
    let revisarToken;
    try {
        // Verifica el token usando la llave secreta
        revisarToken = jwt.verify(token, 'LLAVESECRETA');
    } catch (error) {
        error.statusCode = 500; // Código de estado 500 (Error interno del servidor)
        throw error; // Lanza el error para ser manejado por el middleware de errores
    }

    // Si el token no es válido, lanza un error
    if (!revisarToken) {
        const error = new Error('No autenticado');
        error.statusCode = 401; // Código de estado 401 (No autorizado)
        throw error; // Lanza el error para ser manejado por el middleware de errores
    }

    // Si todo está bien, llama a la siguiente función middleware
    next();
}

export default auth;