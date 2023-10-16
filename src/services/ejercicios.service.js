import sequelize from "../databases/databases.js";
import { Op } from "sequelize";

// obtener un ejercicio segun su id, para mostrar sus datos
const getEjercicioById = async (id) => {
    const rdo = await sequelize.models.Ejercicios.findByPk(id, {
        include: [
            {
                model: sequelize.models.Videos,
                attributes: ['id', 'nombre', 'url']
            },
            {
                model: sequelize.models.Cuerpo_Zonas,
                attributes: ['nombre']
            },
            {
                model: sequelize.models.Categoria_Ejercicios,
                attributes: ['nombre']
            },
        ]
    });

    if (!rdo) {
        return { error: 'No existe el ejercicio' }
    } else {
        rdo.dataValues.nombreZonaCuerpo = rdo.dataValues.Cuerpo_Zona.nombre;
        rdo.dataValues.nombreCategoria = rdo.dataValues.Categoria_Ejercicio.nombre;
        rdo.dataValues.linkVideo = rdo.dataValues.Video ? rdo.dataValues.Video.nombre : ''
        delete rdo.dataValues.Cuerpo_Zona;
        delete rdo.dataValues.Categoria_Ejercicio;
        return rdo.dataValues
    }
}

const ejerciciosServices = {
    getEjercicioById
}

export { ejerciciosServices }