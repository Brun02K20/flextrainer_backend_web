import express from "express";
import cors from "cors";

// importar middleware de error
import { errorHandler } from "./middlewares/error-handler-middleware.js";

// importar todos los routers de la aplicacion
import { usuariosRouter } from "./routes/usuarios.routes.js";
import { planesAlumnosRouter } from "./routes/planesAlumnos.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

// crear los middlewares de uso
app.use('/flextrainer/usuarios', usuariosRouter.router);
app.use('/flextrainer/planesAlumnos', planesAlumnosRouter.router);

// si ocurre algun error, directamente se ejecuta este middleware
app.use(errorHandler);

export default app;