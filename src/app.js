// importacion de librerias y middlewares necesarios para la ejecucion de la aplicacion
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler-middleware.js";

// importando los routers de la aplicacion
import { videosRouter } from "./routes/videos.routes.js";
import { maquinasRouter } from "./routes/maquinas.routes.js";
import { ejerciciosRouter } from "./routes/ejercicios.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

// declarando los middlewares por cada modelo de la aplicacion
app.use('/api/flextrainer/videos', videosRouter.router);
app.use('/api/flextrainer/maquinas', maquinasRouter.router);
app.use('/api/flextrainer/ejercicios', ejerciciosRouter.router);

// si ocurre algun error, directamente se ejecuta este middleware
app.use(errorHandler);

export default app;