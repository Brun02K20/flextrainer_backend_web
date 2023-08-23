import { ResourceNotFound } from "../errors/resource-not-found-error.js";
import { ValidationError } from "sequelize";

// middleware para manejo de errores basicos como un 500 si existe un error del lado del servidor o un error de restricciones en base de datos (400)
const errorHandler = (error, req, res, next) => {
    if (error != undefined) {
        next();
    }

    if (error instanceof ResourceNotFound) {
        return res.status(error.status).json({ error: error.message });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: 'Error imprevisto' });
};

export { errorHandler };