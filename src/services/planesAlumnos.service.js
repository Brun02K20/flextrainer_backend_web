import { Op } from "sequelize";
import sequelize from "../databases/databases.js";
import { planesService } from "./planes.service.js";

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
        whereCondition.nombre = { [Op.like]: `%${nombre.toLowerCase()}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (apellido) { // si hay un apellido, que almacene el filtro
        whereCondition.apellido = { [Op.like]: `%${apellido.toLowerCase()}%` }
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


// consultar los alumnos de un profe, devolviendo los datos de los alumnos y de su plan asociado si es que tiene
const findAlumnosByProfe = async (dniEntrenador) => {
    const alumnosConPlanes = await sequelize.models.Usuarios.findAll({
        where: {
            dniEntrenador: dniEntrenador,
            idRol: 2,
            esActivo: 1
        },
        include: [
            {
                model: sequelize.models.Planes,
                through: {
                    model: sequelize.models.Planes_Alumnos,
                    attributes: [] // No necesitamos ninguna columna adicional de la tabla intermedia
                },
                where: {
                    esActivo: 1
                },
                required: false // Permite incluir también a los alumnos que no tienen planes asociados
            }
        ]
    });

    const a = alumnosConPlanes.map(async (alumno) => {
        const alumnoData = alumno.dataValues;
        const plan = alumno.Planes && alumno.Planes.length > 0 ? alumno.Planes[0].dataValues : null;
        console.log("------------plan------------: ", plan)
        const planDetail = plan ? (plan.id ? await planesService.getDetallePlan(plan.id) : null) : null;
        console.log("-------------detalle del plan------------------: ", planDetail)
        return { alumno: alumnoData, plan: planDetail ? planDetail : null };
    });

    return Promise.all(a);
};





const findAlumnosByProfeByFilters = async (dniProfe, body) => {
    const { dni, nombre, apellido, dadosBaja, genero, idPlan } = body; // desestructuro el objeto

    const whereCondition = {}; // declaro un objeto vacio que va a almacenar las condiciones de los filtros dinamicamente

    if (!nombre && !dni && !apellido && dadosBaja === 1 && !genero && !idPlan) {
        // si viene sin filtros, devuelve el rdo de la ejecucion del getAllAlumnos() de un profe especifico
        console.log("----------se dirige al getAll------------------------")
        return await findAlumnosByProfe(dniProfe)
    }

    if (dni) { // si hay un dni, que almacene el filtro
        whereCondition.dni = { [Op.like]: `%${dni}%` }
    };


    if (nombre) { // si hay un nombre, que almacene el filtro
        whereCondition.nombre = { [Op.like]: `%${nombre.toLowerCase()}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (apellido) { // si hay un apellido, que almacene el filtro
        whereCondition.apellido = { [Op.like]: `%${apellido.toLowerCase()}%` }
        console.log("apellido parseado: ", apellido.toLowerCase())
    }

    if (genero) { // si hay un genero, que almacene el filtro
        whereCondition.genero = genero
    }

    console.log("-----------va a filtrar-----------------------")

    const alumnosDelProfe = await sequelize.models.Usuarios.findAll({
        attributes: {
            exclude: ['password'] // excluir el password de los usuarios
        },
        where: {
            [Op.and]: [
                { dniEntrenador: dniProfe },
                whereCondition,
                {
                    [Op.or]: [
                        { esActivo: 1 },
                        dadosBaja === 0 && { esActivo: 0 }
                    ]
                },
                idPlan ? {
                    '$Planes.id$': idPlan
                } : null
            ]
        },
        include: [
            {
                model: sequelize.models.Planes,
                through: {
                    model: sequelize.models.Planes_Alumnos,
                    attributes: [] // No necesitamos ninguna columna adicional de la tabla intermedia
                },
                where: {
                    esActivo: 1
                },
                required: false // Permite incluir también a los alumnos que no tienen planes asociados
            }
        ]
    })

    const a = alumnosDelProfe.map(async (alumno) => {
        const alumnoData = alumno.dataValues;
        const plan = alumno.Planes && alumno.Planes.length > 0 ? alumno.Planes[0].dataValues : null;
        console.log("------------plan------------: ", plan)
        const planDetail = plan ? (plan.id ? await planesService.getDetallePlan(plan.id) : null) : null;
        console.log("-------------detalle del plan------------------: ", planDetail)
        return { alumno: alumnoData, plan: planDetail ? planDetail : null };
    });

    return Promise.all(a);
}

const findAlumnoEspecificoDeProfe = async (dniProfe, dniAlumno) => {
    const alumnoDelProfe = await sequelize.models.Usuarios.findOne({
        attributes: {
            exclude: ['password'] // excluir el password de los usuarios
        },
        where: {
            dniEntrenador: dniProfe,
            dni: dniAlumno
        },
        include: [
            {
                model: sequelize.models.Planes,
                through: {
                    model: sequelize.models.Planes_Alumnos,
                    attributes: ['observaciones', 'fechaInicio', 'fechaFin'] // No necesitamos ninguna columna adicional de la tabla intermedia
                },
                where: {
                    esActivo: 1
                },
                required: false // Permite incluir también a los alumnos que no tienen planes asociados
            }
        ]
    })


    const alumnoData = alumnoDelProfe.dataValues;
    const plan = alumnoDelProfe.Planes && alumnoDelProfe.Planes.length > 0 ? alumnoDelProfe.Planes[0].dataValues : null;
    console.log("------------plan------------: ", plan)
    const planDetail = plan ? (plan.id ? await planesService.getDetallePlan(plan.id) : null) : null;
    console.log("-------------detalle del plan------------------: ", planDetail)
    const planAlumno = alumnoData.Planes ? (alumnoData.Planes[0] ? alumnoData.Planes[0].dataValues : null) : null;
    return { alumno: alumnoData, plan: planDetail ? planDetail : null, planAlumno: plan ? planAlumno.Planes_Alumnos : null };

}


const deleteAlumnoProfe = async (dniAlumno) => {
    const alumno = await sequelize.models.Usuarios.findOne({
        where: {
            dni: dniAlumno
        }
    })

    if (!alumno) {
        return { error: "No existe alumno con ese dni" }
    }

    await sequelize.models.Planes_Alumnos.destroy({
        where: {
            Usuariodni: dniAlumno
        }
    })

    alumno.dniEntrenador = null;
    await alumno.save()
    return alumno.dataValues

}

const asignarPlanAAlumno = async (body) => { // mi body voy a tener: dniAlumno, idPlan, observaciones, fechaInicio, fechaFin. Validaciones en el front

    console.log("dniAlumno: ", body.dniAlumno)
    console.log("idPlan: ", body.idPlan)

    try {
        const nuevoRegistro = await sequelize.models.Planes_Alumnos.create({
            dniAlumno: body.dniAlumno,
            idPlan: body.idPlan,
            fechaInicio: body.fechaInicio,
            fechaFin: body.fechaFin,
            observaciones: body.observaciones || null
        })

        // nota: en el frontend, las fechas las formatearemos a: año-mes-dia en el front
        return nuevoRegistro.dataValues;
    } catch (error) {
        console.log("ERROR AL CREAR LA INSERCION INTERMEDIA: ", error)
    }
}


const getDetallePlanParaAlumno = async (dniAlumno) => {
    const rdo = await sequelize.models.Planes_Alumnos.findOne({
        where: {
            Usuariodni: dniAlumno
        }
    })

    if (!rdo) {
        return { error: 'ERROR XD' }
    }

    console.log("----------id plan obtenido-----------")
    console.log(rdo.idPlan)

    const planDetail = await planesService.getDetallePlan(rdo.idPlan)

    if (!planDetail) {
        return { error: 'ERROR XD' }
    }

    return { detallePlan: planDetail, aspectosBasicos: rdo }
}





// declaro los servicios a exportar
const planesAlumnosServices = {
    getAll,
    getPlanesAlumnosByFilters,
    findAlumnosByProfe,
    findAlumnosByProfeByFilters,
    findAlumnoEspecificoDeProfe,
    deleteAlumnoProfe,
    asignarPlanAAlumno,
    getDetallePlanParaAlumno
}

export { planesAlumnosServices }