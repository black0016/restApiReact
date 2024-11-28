import express from 'express'; // Importar express

// Importar el controlador de clienteController
import { nuevoCliente, mostrarClientes, mostrarCliente, actualizarCliente, eliminarCliente } from '../controllers/clienteController.js';
// Importar el controlador de productosController
import { subirImagen, nuevoProducto, mostrarProductos, mostrarProducto, actualizarProducto, eliminarProducto, buscarProducto } from '../controllers/productosController.js';
// Importar el controlador de pedidoController
import { nuevoPedido, mostrarPedidos, mostrarPedido, actualizarPedido, eliminarPedido } from '../controllers/pedidoController.js';
// Importar el controlador de usuarioController
import { registrarUsuario, autenticarUsuario } from '../controllers/usuariosController.js';

// Importar el middleware para proteger las rutas
import auth from '../middleware/auth.js';


// Crear un router de express para manejar las rutas
const router = express.Router();


/** RUTAS DEL MODELO DE CLIENTES */

// Ruta para crear un nuevo cliente
router.post('/clientes', nuevoCliente);
// Ruta para listar todos los clientes
router.get('/clientes', auth, mostrarClientes);
// Ruta para consultar un cliente por su id
router.get('/clientes/:idCliente', auth, mostrarCliente);
// Ruta para actualizar un cliente por su id
router.put('/clientes/:idCliente', auth, actualizarCliente);
// Rutan para eliminar un cliente por su id
router.delete('/clientes/:idCliente', auth, eliminarCliente);


/** RUTAS DEL MODELO DE PRODUCTOS */

// Ruta para crear un nuevo producto con una imagen
router.post('/productos', auth, subirImagen, nuevoProducto);
// Ruta para listar todos los productos
router.get('/productos', auth, mostrarProductos);
// Ruta para consultar un producto por su id
router.get('/productos/:idProducto', auth, mostrarProducto);
// Ruta para actualizar un producto por su id
router.put('/productos/:idProducto', auth, subirImagen, actualizarProducto);
// Ruta para eliminar un producto por su id
router.delete('/productos/:idProducto', auth, eliminarProducto);
// Ruta para consultar productos por coincidencia (Filtro)
router.post('/productos/busqueda/:query', auth, buscarProducto);


/** RUTAS DEL MODELO DE PEDIDOS */

// Ruta para crear un nuevo pedido
router.post('/pedidos', auth, nuevoPedido);
// Ruta para listar todos los pedidos
router.get('/pedidos', auth, mostrarPedidos);
// Ruta para mostrar un pedido por su id
router.get('/pedidos/:idPedido', auth, mostrarPedido);
// Ruta para actualizar un pedido por su id
router.put('/pedidos/:idPedido', auth, actualizarPedido);
// Ruta para eliminar un pedido por su id
router.delete('/pedidos/:idPedido', auth, eliminarPedido);

/** RUTAS DEL MODELO DE USUARIOS  */

// Ruta para crear un nuevo usuario
router.post('/crear-cuenta', auth, registrarUsuario);
// Ruta para iniciar sesión
router.post('/iniciar-sesion', autenticarUsuario);


export default router; // Exportar el router