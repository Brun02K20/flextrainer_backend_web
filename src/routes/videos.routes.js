import express from "express";
import { videosServices } from "../services/videos.service.js";

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const resultado = await videosServices.getAll()
        return res.json(resultado)
    } catch (error) {
        next(error)
    }
});

const videosRouter = {
    router
}

export { videosRouter }