import { Op } from "sequelize";
import sequelize from "../databases/databases.js";

const getAll = async () => {
    const planes = await sequelize.models.Planes_Alumnos.findAll({
        include: [
            {
                model: sequelize.models.Planes,
                where: {
                    esActivo: 1
                },
                include: [
                    {
                        model: sequelize.models.Usuarios,
                        attributes: {
                            exclude: ['password'] // Excluye la contraseña para mayor seguridad
                        },
                    }
                ]
            },
            {
                model: sequelize.models.Usuarios,
                attributes: {
                    exclude: ['password'] // Excluye la contraseña para mayor seguridad
                },
                where: {
                    esActivo: 1
                },
            }
        ]
    })
    return planes.map(r => {
        delete r.dataValues.Usuariodni
        delete r.dataValues.Planeid
        return r.dataValues
    })
}


const getPlanesAlumnosByFilters = async (body) => {
    const { dni, nombre, apellido, dadosBaja } = body;
    console.log(
        "dni: ", dni, " nombre: ", nombre, " apellido: ", apellido, "DB: ", dadosBaja
    )
    const whereCondition = {};

    if (!dni && !nombre && !apellido && dadosBaja === 1) {
        return await getAll()
    }

    if (dni) {
        whereCondition.dni = { [Op.like]: `%${dni}%` }
    };

    if (nombre) {
        whereCondition.nombre = { [Op.like]: `%${nombre}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (apellido) {
        whereCondition.apellido = { [Op.like]: `%${apellido}%` }
        console.log("apellido parseado: ", apellido.toLowerCase())
    }

    const planes = await sequelize.models.Planes_Alumnos.findAll({
        include: [
            {
                model: sequelize.models.Planes,
                where: {
                    esActivo: 1
                },
                // incluyo al profe
                include: [
                    {
                        model: sequelize.models.Usuarios,
                        attributes: {
                            exclude: ['password'] // Excluye la contraseña para mayor seguridad
                        },
                    }
                ]
            },
            // incluyo al alumno
            {
                model: sequelize.models.Usuarios,
                attributes: {
                    exclude: ['password'] // Excluye la contraseña para mayor seguridad
                },
                where: {
                    [Op.and]: [
                        whereCondition,
                        {
                            [Op.or]: [
                                { esActivo: 1 },
                                dadosBaja === 0 && { esActivo: 0 } // Agregamos esta condición
                            ]
                        }
                    ]
                }
            }
        ]
    })

    return planes.map(r => {
        delete r.dataValues.Usuariodni
        delete r.dataValues.Planeid
        return r.dataValues
    })
}

const planesAlumnosServices = {
    getAll,
    getPlanesAlumnosByFilters
}

export { planesAlumnosServices }