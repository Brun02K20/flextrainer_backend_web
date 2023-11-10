import express from "express"; // importo la libreria express
import { usuariosServices } from "../services/usuarios.service.js"; // importo los servicios necesarios
const router = express.Router(); // creo el objeto de routeo

// los routers, basicamente, son por llamrlos de alguna manera: almacenadores de ENDPOINTS para una URL.
// Una URL, bsaicamente, es un link. Mientras que un ENDPOINT = VERBO + URL.
// Los verbos, en concreto, son 5: GET, POST, PUT, PATCH, DELETE (aunque nadie usa patch, es un lio).
// Un ejemplo puede ser que un endpoint sea: 
// GET http://localhost:4001/flextrainer/usuarios/

// se crea un router por cada modelo que tengas, aunque, la verdad, no siempre esta regla se cumple, 
// es criterio de cada equipo de desrrollo.

// endpoint de obtencion de todos los usuarios sin filtros
router.get('/', async (req, res, next) => {
    try {
        // aca lo que hace es invocar al servicio para que este se ejecute, y devolver el resultado de dicha
        // ejecucion en formato json, el formato json quiere decir JavaScriptObjectNotation, que en definitiva,
        // dice que un objeto tiene la siguiente forma: {"clave1": valor1, ..., "claveN": valorN}
        // Y esta notacion la utilizan todas las APIs del mundo para intercomunicarse
        const rdo = await usuariosServices.getAll();
        return res.json(rdo)
    } catch (error) {
        // esto basicamente, lo que va a hacer es que si entra por este catch, es decir, que si hubo un error
        // que no lo puede capturar el servicio, invoca al siguiente middleware (generalmente va a ser el de manejo de errores)
        // que pueda atrapar este error para asi mostrarlo por pantalla
        next(error)
    }
})

// endpoint de la creacion de un nuevo usuario
router.post('/', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.insertUser(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint del login de un usuario en la app
router.post('/login', async (req, res, next) => {
    try {
        console.log("entrando al login: ", req.body)
        const rdo = await usuariosServices.login(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de la obtencion de un usuario en funcion de un dni
router.get('/usuario/:dni', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getUserByDni(req.params.dni)
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de la obtencion de 0 a N usuarios, en funcion de 0 o mas filtros
router.post('/byFilters', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getUserByFilters(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de la desactivacion de un usuario del sistema
router.delete('/usuario/delete/:dni', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.deleteUser(req.params.dni);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

// endpoint de la reactivacion de un usuario en el sistema
router.put('/usuario/activate/:dni', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.activateUser(req.params.dni);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

// endpoint de la asignacion de un rol a un usuario
router.put('/usuario/asignarRol', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.asignarRolYProfe(req.body)
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de la actualizacion de un usuario
router.put('/usuario/update', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.updateUser(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de la obtencion de todos los entrenadores activos
router.get('/entrenadoresActivos', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getCoachesActivos();
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.put('/usuario/asignarProfe', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.asignarSoloProfe(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// almaceno el router creado dentro de un objeto, esto para su posterior uso en las declaraciones
// de los middlewares de la api, que estan ubicadas en el archivo app.js, son los 
// app.use('url', talRouter.router)
const usuariosRouter = { router };
export { usuariosRouter }