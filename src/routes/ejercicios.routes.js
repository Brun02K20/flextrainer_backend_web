import express from "express"; // importo la libreria express
import { ejerciciosServices } from "../services/ejercicios.service.js"; // importo los servicios necesarios
const router = express.Router(); // creo el objeto de routeo

// endpoint para obtener un ejercicio segun su id
router.get('/ejercicio/:id', async (req, res, next) => {
    try {
        const rdo = await ejerciciosServices.getEjercicioById(req.params.id);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.get('/byZC/:id', async (req, res, next) => {
    try {
        const rdo = await ejerciciosServices.getEjerciciosByZonaCuerpo(req.params.id);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

const ejerciciosRouter = { router }
export { ejerciciosRouter }