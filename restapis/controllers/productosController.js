import mongoose from 'mongoose'; // Importar mongoose para validar el ObjectId
import Productos from "../models/Productos.js"; // Importar el modelo de Productos de la base de datos
import multer from 'multer'; // Importar multer para subir archivos
import shortid from "shortid"; // Importar shortid para generar un id único
import path from 'path'; // Importar path para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Importar fileURLToPath para convertir URL a ruta de archivo
import fs from 'fs'; // Importar fs para manejar el sistema de archivos


// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Ruta del directorio de uploads en la raíz del proyecto
const uploadDir = path.resolve(__dirname, '../uploads/');
// Verificar si el directorio de uploads existe, si no, crearlo
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


// Configuración de multer para subir archivos
const configuracionMulter = {
    // Configuración del almacenamiento de archivos
    storage: multer.diskStorage({
        // Directorio de destino para los archivos subidos
        destination: (req, file, cb) => {
            // Guarda los archivos en el directorio 'uploads'
            cb(null, uploadDir);
        },
        // Nombre del archivo subido
        filename: (req, file, cb) => {
            // Obtiene la extensión del archivo a partir del tipo MIME
            const extension = file.mimetype.split('/')[1];
            // Genera un nombre único para el archivo usando shortid y agrega la extensión
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    // Filtro para aceptar solo ciertos tipos de archivos
    fileFilter(req, file, cb) {
        // Acepta solo archivos JPEG y PNG
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true); // Acepta el archivo
        } else {
            // Si el archivo no es JPEG o PNG, rechaza el archivo
            cb(new Error('Formato no válido. Solo se permiten archivos en formato JPG y PNG'), false);
        }
    },
}

// Configura multer para subir un solo archivo con el campo 'imagen'
const upload = multer(configuracionMulter).single('imagen');

// Middleware para subir la imagen al servidor
const subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error }); // Responder al cliente con un mensaje de error
        }
        return next(); // Pasar al siguiente middleware
    });
}

// Crea un nuevo producto en la base de datos
const nuevoProducto = async (req, res, next) => {
    const producto = new Productos(req.body); // Crear un nuevo producto con los datos recibidos en el body
    try {
        // Si se subió una imagen, asignarla al producto
        if (req.file && req.file.filename) {
            producto.imagen = req.file.filename; // Asignar la imagen al producto
        }
        await producto.save(); // Guardar el producto en la base de datos
        res.json({ mensaje: 'Producto creado correctamente' }); // Responder al cliente con un mensaje de éxito
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        next(); // Pasar al siguiente middleware
    }
}

// Lista todos los productos de la base de datos
const mostrarProductos = async (req, res, next) => {
    try {
        const productos = await Productos.find({}); // Obtener todos los productos de la base de datos
        res.json(productos); // Responder al cliente con los productos obtenidos
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        next(); // Pasar al siguiente middleware
    }
}

// Lista un producto por su id de la base de datos
const mostrarProducto = async (req, res, next) => {
    try {
        const { idProducto } = req.params;

        // Validar si el idProducto es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(idProducto)) {
            res.json({ mensaje: 'El ID del producto no es válido' });
            return next();
        }

        const producto = await Productos.findById(idProducto); // Buscar un producto por su id
        if (!producto) { // Si el producto no existe
            res.json({ mensaje: 'El producto no existe' }); // Responder al cliente con un mensaje de error
            return next(); // Pasar al siguiente middleware
        }
        res.json(producto); // Responder al cliente con el producto encontrado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        next(); // Pasar al siguiente middleware
    }
}

// Actualiza un producto por su id en la base de datos
const actualizarProducto = async (req, res, next) => {
    try {
        // Obtener el id del producto de los parámetros de la ruta (URL)
        const { idProducto } = req.params;

        // Validar si el idProducto es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(idProducto)) {
            res.json({ mensaje: 'El ID del producto no es válido' });
            return next();
        }

        // Buscar el producto que se va a actualizar por su id
        let productoAntiguo = await Productos.findById(idProducto);
        // Construir un nuevo producto con los datos actualizados
        let nuevoProducto = req.body;

        // Verificar si se subió una imagen
        if (req.file && req.file.filename) {
            // Asignar la imagen al producto
            nuevoProducto.imagen = req.file.filename;
            // Eliminar la imagen anterior del servidor si existe
            if (productoAntiguo.imagen) {
                fs.unlinkSync(`${uploadDir}/${productoAntiguo.imagen}`);
            }
        } else {
            // Si no se subió una imagen, mantener la imagen actual
            nuevoProducto.imagen = productoAntiguo.imagen;
        }

        // Actualizar el producto en la base de datos
        let producto = await Productos.findOneAndUpdate({ _id: idProducto }, nuevoProducto, { new: true });
        // Responder al cliente con el producto actualizado
        res.json({ mensaje: 'Producto actualizado correctamente', producto });
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        next(); // Pasar al siguiente middleware
    }
}

// Elimina un producto por su id de la base de datos
const eliminarProducto = async (req, res, next) => {
    try {
        // Obtener el id del producto de los parámetros de la ruta (URL)
        const { idProducto } = req.params;

        // Validar si el idProducto es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(idProducto)) {
            res.json({ mensaje: 'El ID del producto no es válido' });
            return next();
        }

        // Buscar el producto que se va a eliminar por su id
        let producto = await Productos.findById(idProducto);

        // Verificar si el producto tiene una imagen
        if (producto.imagen) {
            // Eliminar la imagen del servidor
            fs.unlinkSync(`${uploadDir}/${producto.imagen}`);
        }

        // Eliminar el producto de la base de datos
        await Productos.findByIdAndDelete(idProducto);
        // Responder al cliente con un mensaje de éxito
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        next(); // Pasar al siguiente middleware
    }
}

// Función para buscar un producto en la base de datos
const buscarProducto = async (req, res, next) => {
    try {
        // Obtiene el parámetro de consulta de la solicitud
        const { query } = req.params;
        // Busca productos cuyo nombre coincida con la expresión regular (insensible a mayúsculas)
        const producto = await Productos.find({ nombre: new RegExp(query, 'i') });
        // Envía la respuesta en formato JSON con los productos encontrados
        res.json(producto);
    } catch (error) {
        // Imprime el error en la consola
        console.log('error', error);
        // Llama al siguiente middleware
        next();
    }
}

export {
    subirImagen,  // Exportar el middleware subirImagen para subir la imagen al servidor
    nuevoProducto,  // Exportar la función nuevoProducto para crear un nuevo producto
    mostrarProductos,  // Exportar la función mostrarProductos para listar todos los productos
    mostrarProducto,  // Exportar la función mostrarProducto para consultar un producto por su id
    actualizarProducto,  // Exportar la función actualizarProducto para actualizar un producto por su id
    eliminarProducto,  // Exportar la función eliminarProducto para eliminar un producto por su id
    buscarProducto, // Exporta la función buscarProducto para buscar productos en la base de datos por coincidencia de nombre (similar a un filtro 'LIKE')
}