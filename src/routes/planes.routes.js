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

// crear un nuevo plan
router.post("/createPlan", async (req, res, next) => {
    try {
        const planes = await planesService.createPlan(req.body);
        return res.status(201).json({ message: 'Plan creado con éxito.', planes: planes });
    } catch (error) {
        console.error("ERROR CREANDO: ", error);
        res.status(500).json({ message: 'Error al crear el plan.' });
        next(error)
    }
})

// obtener por profe y por filtros
router.post("/getByProfeByFilters/:dniProfe", async (req, res, next) => {
    try {
        const planes = await planesService.getPlanesByProfeByFilters(req.body, req.params.dniProfe);
        return res.json(planes)
    } catch (error) {
        next(error)
    }
})


// obtener un plan esppecifico
router.get("/plan/:id", async (req, res, next) => {
    try {
        const planes = await planesService.getDetallePlan(req.params.id);
        return res.json(planes)
    } catch (error) {
        next(error)
    }
})

// endpoint de la desactivacion de un plan del sistema
router.delete('/plan/delete/:id', async (req, res, next) => {
    try {
        const rdo = await planesService.deletePlan(req.params.id);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

// endpoint de la reactivacion de un usuario en el sistema
router.put('/plan/activate/:id', async (req, res, next) => {
    try {
        const rdo = await planesService.activatePlan(req.params.id);
        return res.json(rdo);
    } catch (error) {
        next(error)
    }
})

// endpoint para la actualizacion de un plan
router.put("/plan/update", async (req, res, next) => {
    try {
        const rdo = await planesService.updatePlan(req.body)
        return res.json(rdo)
    } catch (error) {
        next(error)
    }
})

const planesRouter = { router }
export { planesRouter }