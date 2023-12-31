import sequelize from "../databases/databases.js";
import { Op } from "sequelize";

// obtener un ejercicio segun su id, para mostrar sus datos
const getEjercicioById = async (id) => {
    const rdo = await sequelize.models.Ejercicios_Maquinas.findOne({
        include: [
            {
                model: sequelize.models.Ejercicios,
                where: {
                    id: id
                },
                include: [
                    {
                        model: sequelize.models.Categoria_Ejercicios,
                    },
                    {
                        model: sequelize.models.Tipo_Ejercicios,
                        attributes: ['nombre']
                    },
                    {
                        model: sequelize.models.Cuerpo_Zonas,
                        attributes: ['nombre']
                    },
                    {
                        model: sequelize.models.Videos,
                        attributes: ['id', 'nombre', 'url']
                    },
                ]
            },
            {
                model: sequelize.models.Maquinas
            }
        ]
    });

    rdo.dataValues.linkVideo = rdo.dataValues.Ejercicio.Video ? rdo.dataValues.Ejercicio.Video.url : ''

    delete rdo.dataValues.idEjercicio
    delete rdo.dataValues.idMaquina
    return rdo.dataValues

}

const getEjerciciosByZonaCuerpo = async (idZonaCuerpo) => {
    const rdo = await sequelize.models.Ejercicios_Maquinas.findAll({
        include: [
            {
                model: sequelize.models.Ejercicios,
                where: {
                    idZonaCUerpo: idZonaCuerpo
                },
                include: [
                    {
                        model: sequelize.models.Categoria_Ejercicios,
                        attributes: ['nombre']
                    },
                    {
                        model: sequelize.models.Tipo_Ejercicios,
                        attributes: ['nombre']
                    },
                    {
                        model: sequelize.models.Cuerpo_Zonas,
                        attributes: ['nombre']
                    },
                ]
            },
            {
                model: sequelize.models.Maquinas
            }
        ]
    });
    return rdo.map(e => {
        delete e.dataValues.idEjercicio
        delete e.dataValues.idMaquina
        return e.dataValues
    })
}

const ejerciciosServices = {
    getEjercicioById,
    getEjerciciosByZonaCuerpo
}

export { ejerciciosServices }