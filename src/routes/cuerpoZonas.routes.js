import express from "express"; // importo la libreria express
import { cuerpoZonasServices } from "../services/cuerpoZonas.service.js";
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rdo = await cuerpoZonasServices.getAll()
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

const cuerpoZonasRouter = { router }
export { cuerpoZonasRouter }