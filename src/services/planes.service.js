import { Op } from "sequelize";
import sequelize from "../databases/databases.js";

const getAll = async () => {
    const planes = await sequelize.models.Planes.findAll();
    return planes.map(e => e.dataValues);
}

const getPlanesByProfesor = async (dniProfe) => {
    const planes = await sequelize.models.Planes.findAll({
        where: {
            dniProfesor: dniProfe
        }
    });
    return planes.map(e => e.dataValues);
}

const planesService = {
    getAll,
    getPlanesByProfesor
}

export { planesService }