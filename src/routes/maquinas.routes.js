import express from "express";
import { maquinasServices } from "../services/maquinas.service.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rdo = await maquinasServices.getAll()
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
});

const maquinasRouter = {
    router
}

export { maquinasRouter }