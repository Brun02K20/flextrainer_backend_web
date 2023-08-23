import express from "express";
import { ejerciciosServices } from "../services/ejercicios.service.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const rdo = await ejerciciosServices.getAll()
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

const ejerciciosRouter = {
    router
}

export { ejerciciosRouter }