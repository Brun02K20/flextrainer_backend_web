import express from "express"; // importo la libreria express
import { maquinasServices } from "../services/maquinas.service.js"; // importo los servicios necesarios
const router = express.Router(); // creo el objeto de routeo

// endpoint para obtener todas las maquinas activas
router.get('/', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getAll();
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint para obtener una maquina segun su id
router.get('/maquina/:id', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getMaquinaById(req.params.id);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint para obtener 0 a N maquinas, funcion de 0 o mas filtros
router.post('/byFilters', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getMaquinasByFilters(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

const maquinasRouter = { router }
export { maquinasRouter }