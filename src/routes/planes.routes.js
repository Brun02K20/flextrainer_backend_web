import express from "express"; // importo la libreria express
import { planesService } from "../services/planes.service.js";
const router = express.Router(); // creo el objeto de routeo


router.get("/", async (req, res, next) => {
    try {
        const planes = await planesService.getAll();
        return res.json(planes)
    } catch (error) {
        next(error)
    }
})

router.get("/byProfesor/:dniProfe", async (req, res, next) => {
    try {
        const planes = await planesService.getPlanesByProfesor(req.params.dniProfe);
        return res.json(planes)
    } catch (error) {
        next(error)
    }
})

const planesRouter = { router }
export { planesRouter }