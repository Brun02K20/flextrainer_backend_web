import express from "express"; // importo la libreria express
import { planesAlumnosServices } from "../services/planesAlumnos.service.js"; // importo los servicios necesarios
const router = express.Router(); // creo el objeto de routeo

// endpoint de la obtencion de todos los planes por alumno
router.get('/', async (req, res, next) => {
    try {
        const rdo = await planesAlumnosServices.getAll()
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// endpoint de l obtencion de los planes por alumnos, en funcion de los filtros que se pasen por parametro
router.post('/byFilters', async (req, res, next) => {
    try {
        const rdo = await planesAlumnosServices.getPlanesAlumnosByFilters(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

// creo el objeto que envuelve al router
const planesAlumnosRouter = {
    router
}

export { planesAlumnosRouter }