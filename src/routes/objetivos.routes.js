import express from "express"; // importo la libreria express
import { objetivosServices } from "../services/objetivos.service.js";
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rdo = await objetivosServices.getAll();
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})


const objetivosRouter = { router }
export { objetivosRouter }