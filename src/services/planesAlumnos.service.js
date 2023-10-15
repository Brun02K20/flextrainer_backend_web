import { Op } from "sequelize";
import sequelize from "../databases/databases.js";

// obtener todos los planes con sus respectivos alumnos
const getAll = async () => {
    const planes = await sequelize.models.Planes_Alumnos.findAll({ // buscar de latabla intermedia Planes_Alumnos
        include: [ // incluyendo los planes activos
            {
                model: sequelize.models.Planes,
                where: {
                    esActivo: 1
                },
                include: [ // y de esos planes activos incluirles el profesor que los creo
                    {
                        model: sequelize.models.Usuarios,
                        attributes: {
                            exclude: ['password'] // Excluye la contraseña para mayor seguridad
                        },
                    }
                ]
            },
            { // y tambien incluir aqui, los alumnos activos, vinculados a cada plan
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

    // devolver el resultado de la consulta
    return planes.map(r => {
        delete r.dataValues.Usuariodni
        delete r.dataValues.Planeid
        return r.dataValues
    })
}

// obtener Planes por Alumno, en funcion de 0 o mas filtros, pasados como parametro, en un objeto llamado "body"
const getPlanesAlumnosByFilters = async (body) => {
    const { dni, nombre, apellido, dadosBaja } = body; // desestructuro el objeto
    console.log("dni: ", dni, " nombre: ", nombre, " apellido: ", apellido, "DB: ", dadosBaja) // imprimo los datos, por si las dudas, para saber si estan bien
    const whereCondition = {}; // declaro un objeto vacio que va a almacenar las condiciones de los filtros dinamicamente

    if (!dni && !nombre && !apellido && dadosBaja === 1) { // si viene sin filtros, devuelve el rdo de la ejecucion del getAll()
        return await getAll()
    }

    if (dni) { // si hay un dni, que almacene el filtro
        whereCondition.dni = { [Op.like]: `%${dni}%` }
    };

    if (nombre) { // si hay un nombre, que almacene el filtro
        whereCondition.nombre = { [Op.like]: `%${nombre}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (apellido) { // si hay un apellido, que almacene el filtro
        whereCondition.apellido = { [Op.like]: `%${apellido}%` }
        console.log("apellido parseado: ", apellido.toLowerCase())
    }

    // empiezo a buscar los planes por alumno
    const planes = await sequelize.models.Planes_Alumnos.findAll({
        include: [ // incluyendo los planes activos
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
                            [Op.or]: [ // indicando aca si incluir a los alumnos dados de baja o no
                                { esActivo: 1 },
                                dadosBaja === 0 && { esActivo: 0 }
                            ]
                        }
                    ]
                }
            }
        ]
    })

    // devuelvo el resultado
    return planes.map(r => {
        delete r.dataValues.Usuariodni
        delete r.dataValues.Planeid
        return r.dataValues
    })
}

// declaro los servicios a exportar
const planesAlumnosServices = {
    getAll,
    getPlanesAlumnosByFilters
}

export { planesAlumnosServices }