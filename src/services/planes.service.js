import { Op } from "sequelize";
import sequelize from "../databases/databases.js";

const getAll = async () => {
    const planes = await sequelize.models.Planes.findAll();
    return planes.map(e => e.dataValues);
}

// obtener los planes segun un profesor, aca se esta incluyendo incluso los dados de baja
const getPlanesByProfesor = async (dniProfe) => {
    console.log("que mierda pasa all: ", dniProfe)
    const planes = await sequelize.models.Planes.findAll({
        where: {
            dniProfesor: dniProfe,
            esActivo: 1
        },
        include: [ // y de esos planes activos incluirles el profesor que los creo
            {
                model: sequelize.models.Usuarios,
                attributes: {
                    exclude: ['password'] // Excluye la contraseña para mayor seguridad
                },
            },
            {
                model: sequelize.models.Objetivos
            }
        ],
        attributes: {
            include: [
                // Agrega una columna virtual "cantidadSesiones" que contiene la cantidad de sesiones
                [sequelize.literal('(SELECT COUNT(*) FROM Sesiones WHERE Sesiones.idPlan = Planes.id)'), 'cantidadSesiones'],
            ]
        }
    });
    return planes.map(e => e.dataValues);
}


// obtener los planes del profe segun filtros:
const getPlanesByProfeByFilters = async (body, dniProfe) => {
    const { nombre, idObjetivo, dadosBaja, cantSesiones } = body; // desestructuro el objeto

    const whereCondition = {}; // declaro un objeto vacio que va a almacenar las condiciones de los filtros dinamicamente

    if (!nombre && !idObjetivo && !cantSesiones && dadosBaja === 1) {
        // si viene sin filtros, devuelve el rdo de la ejecucion del getAll()
        console.log("que mierda pasa filtros: ", dniProfe)
        return await getPlanesByProfesor(dniProfe)
    }

    if (nombre) { // si hay un nombre, que almacene el filtro. funciona
        whereCondition.nombre = { [Op.like]: `%${nombre}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (idObjetivo) { // funciona
        whereCondition.idObjetivo = idObjetivo;
    }

    if (cantSesiones) {
        whereCondition.id = {
            [Op.in]: sequelize.literal(`
                (SELECT P.id
                FROM Planes P
                INNER JOIN Sesiones S ON P.id = S.idPlan
                GROUP BY P.id
                HAVING COUNT(S.id) = ${cantSesiones})
            `),
        };
    }

    const planes = await sequelize.models.Planes.findAll({
        where: {
            [Op.and]: [
                { dniProfesor: dniProfe },
                whereCondition,
                {
                    [Op.or]: [ // indicando aca si incluir a los planes dados de baja o no. funciona
                        { esActivo: 1 },
                        dadosBaja === 0 && { esActivo: 0 }
                    ]
                }
            ]
        },
        include: [ // y de esos planes activos incluirles el profesor que los creo
            {
                model: sequelize.models.Usuarios,
                attributes: {
                    exclude: ['password'] // Excluye la contraseña para mayor seguridad
                }
            },
            {
                model: sequelize.models.Objetivos
            }
        ],
        attributes: {
            include: [
                // Agrega una columna virtual "cantidadSesiones" que contiene la cantidad de sesiones
                [sequelize.literal('(SELECT COUNT(*) FROM Sesiones WHERE Sesiones.idPlan = Planes.id)'), 'cantidadSesiones'],
            ]
        }
    });

    return planes.map(e => e.dataValues);
}


// servicio de la insercion de un plan. ANDAAAAAAAAAAAA
const createPlan = async (plan) => {
    try {
        const nuevoPlan = await sequelize.models.Planes.create({
            nombre: plan.nombre,
            esActivo: 1,
            dniProfesor: plan.dniProfesor,
            idObjetivo: plan.objetivo,
            observaciones: null
        })
        console.log("idplan creado; ", nuevoPlan.dataValues)

        const sesiones = plan.sesiones;

        for (const sesionData of sesiones) {
            const nuevaSesion = await sequelize.models.Sesiones.create({
                nombre: 'a',
                idPlan: nuevoPlan.id,
            });

            const ejercicios = sesionData.ejercicios;

            for (const ejercicioData of ejercicios) {

                console.log("-------------estoy en el de crear el detalle----------------")
                console.log("idplan creado; ", nuevoPlan.id)
                console.log("idSesion creada", nuevaSesion.id)
                // Crear una nueva entrada en la tabla "Sesion_Ejercicios"
                await sequelize.models.Sesion_Ejercicios.create({
                    Ejercicioid: ejercicioData.ejercicio.id,
                    Planeid: nuevoPlan.id,
                    Sesioneid: nuevaSesion.id,
                    tiempo: ejercicioData.tiempoEjercicio || null,
                    series: ejercicioData.seriesEjercicio || null,
                    repeticiones: ejercicioData.repsEjercicio || null,
                    descanso: ejercicioData.descanso || null,
                }, {
                    fields: ['Ejercicioid', 'Planeid', 'Sesioneid', 'tiempo', 'series', 'repeticiones', 'descanso']
                });
            }
        }
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

const getDetallePlan = async (idPlan) => {
    try {
        // Primero, obtén los datos básicos del plan
        const plan = await sequelize.models.Planes.findOne({
            where: { id: idPlan },
            include: [
                {
                    model: sequelize.models.Objetivos,
                    attributes: ["nombre"]
                }
            ]
        });

        // Luego, cuenta la cantidad de sesiones asociadas a este plan
        const cantSesiones = await sequelize.models.Sesiones.count({
            where: {
                idPlan: idPlan
            },
        });

        // Ahora, obtén todas las sesiones de este plan
        const sesiones = await sequelize.models.Sesiones.findAll({
            where: {
                idPlan: idPlan
            },
            attributes: ['id', 'nombre'],
        });

        // Itera a través de las sesiones y busca los ejercicios asociados a cada una
        for (const sesion of sesiones) {
            sesion.dataValues.ejercicios = await sequelize.models.Sesion_Ejercicios.findAll({
                where: {
                    Planeid: idPlan,
                    Sesioneid: sesion.id
                },
                include: [
                    {
                        model: sequelize.models.Ejercicios, // Reemplaza con el nombre correcto de tu modelo Ejercicio
                        include: [
                            {
                                model: sequelize.models.Categoria_Ejercicios,
                            },
                            {
                                model: sequelize.models.Tipo_Ejercicios,
                                attributes: ['nombre'],
                            },
                            {
                                model: sequelize.models.Cuerpo_Zonas,
                                attributes: ['nombre'],
                            },
                            // {
                            //     model: sequelize.models.Videos,
                            //     attributes: ['id', 'nombre', 'url'],
                            // },
                            {
                                model: sequelize.models.Maquinas, // Incluye el modelo Maquinas
                                through: { attributes: [] }, // No incluye atributos de la relación Ejercicios_Maquinas
                            }
                        ],
                    },
                ],
                raw: true, // Devuelve resultados en bruto sin columnas generadas por Sequelize
                attributes: { exclude: ['id'] },
            });
        }

        // buscar el objetivo
        const objetivoPlan = await sequelize.models.Objetivos.findOne({
            where: {
                id: plan.idObjetivo
            }
        })

        // Forma el objeto de salida
        const result = {
            nombre: plan.nombre,
            objetivo: objetivoPlan,
            cantSesiones,
            sesiones,
            dniProfesor: plan.dniProfesor,
        };

        return result;

    } catch (error) {
        console.log("ERROR AL OBTENER PLAN: ", error)
    }
}

const deletePlan = async (idPlan) => {
    const planToDelete = await sequelize.models.Planes.findOne({ // buscar usuario activo, y que tenga el dni ingresado por parametro
        where: {
            esActivo: 1,
            id: idPlan
        }
    })

    if (!planToDelete) { // si no hay usuario que cumpla con lo anterior, devuelve el error
        return { error: 'No existe el plan que se desea borrar' }
    }

    await sequelize.models.Planes_Alumnos.destroy({
        where: {
            Planeid: planToDelete.id
        }
    })

    planToDelete.esActivo = 0; // si lo hay, actualiza su estado de actividad a 0, dandolo de baja de forma logica
    await planToDelete.save(); // guarda el cambio del atributo
    return { message: 'Plan borrado exitosamente' } // devuelve el mensaje de que se borro exitosamente
}


// reactivar un plan dado de baja, actualizando su atributo esActivo, de 0 a 1
const activatePlan = async (idPlan) => {
    const planToActivate = await sequelize.models.Planes.findOne({ // buscar usuario inactivo, y que tenga el dni ingresado por parametro
        where: {
            esActivo: 0,
            id: idPlan
        }
    })

    if (!planToActivate) { // si no encuentra el usuario, que devuelva este error
        return { error: 'Este plan ya esta activo o no existe el plan a activar' }
    }

    planToActivate.esActivo = 1; // si lo encuentra, que actualice su estado de actividad a 1
    await planToActivate.save(); // guarda el cambio
    return { message: 'plan reactivado exitosamente' } // devuelve el mensaje de que se activo correctamente
}

const planesService = {
    getAll,
    getPlanesByProfesor,
    createPlan,
    getPlanesByProfeByFilters,
    getDetallePlan,
    deletePlan,
    activatePlan
}

export { planesService }