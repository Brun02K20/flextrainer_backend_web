import express from "express";
import cors from "cors";

// importar middleware de error
import { errorHandler } from "./middlewares/error-handler-middleware.js";

// importar todos los routers de la aplicacion
import { usuariosRouter } from "./routes/usuarios.routes.js";
import { planesAlumnosRouter } from "./routes/planesAlumnos.routes.js";
import { maquinasRouter } from "./routes/maquinas.routes.js";
import { ejerciciosRouter } from "./routes/ejercicios.routes.js";

// creando la aplicacion express
const app = express();
app.use(express.json());
app.use(cors()); // configurando cors para que un cliente frontend pueda hacer peticiones a la api

// crear los middlewares de uso
app.use('/flextrainer/usuarios', usuariosRouter.router);
app.use('/flextrainer/planesAlumnos', planesAlumnosRouter.router);
app.use('/flextrainer/maquinas', maquinasRouter.router);
app.use('/flextrainer/ejercicios', ejerciciosRouter.router);

// si ocurre algun error, directamente se ejecuta este middleware
app.use(errorHandler);

export default app;