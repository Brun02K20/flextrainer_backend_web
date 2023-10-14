import express from "express"
import { usuariosServices } from "../services/usuarios.service.js";
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getAll();
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.insertUser(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        console.log("entrando al login: ", req.body)
        const rdo = await usuariosServices.login(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.get('/usuario/:dni', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getUserByDni(req.params.dni)
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.post('/byFilters', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getUserByFilters(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.delete('/usuario/delete/:dni', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.deleteUser(req.params.dni);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

router.put('/usuario/activate/:dni', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.activateUser(req.params.dni);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

router.put('/usuario/asignarRol', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.asignarRolYProfe(req.body)
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.put('/usuario/update', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.updateUser(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})


// rutas de soporte
router.get('/entrenadoresActivos', async (req, res, next) => {
    try {
        const rdo = await usuariosServices.getCoachesActivos();
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})
const usuariosRouter = { router };
export { usuariosRouter }