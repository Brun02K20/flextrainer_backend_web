import express from "express"
import { planesAlumnosServices } from "../services/planesAlumnos.service.js"
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rdo = await planesAlumnosServices.getAll()
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

router.post('/byFilters', async (req, res, next) => {
    try {
        const rdo = await planesAlumnosServices.getPlanesAlumnosByFilters(req.body);
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

const planesAlumnosRouter = {
    router
}

export { planesAlumnosRouter }