import sequelize from "../databases/databases.js"; // importo las definiciones de los modelos
import { Op } from "sequelize"; // importo las funcionalidades de operaciones de bases de datos

// obtener todas las maquinas activas
const getAll = async () => {
    const rdo = await sequelize.models.Maquinas.findAll({
        where: {
            esActivo: 1
        },
        order: [['id', 'ASC']]
    });

    return rdo.map(r => r.dataValues)
}

// obtener una maquina en funcion de su id, que es su PK, ademas de obtener tambien todos los ejercicios 
// que se pueden hacer en esa maquina. Para el componente de ver detalle maquina
const getMaquinaById = async (id) => {
    const rdo = await sequelize.models.Maquinas.findByPk(id);
    if (rdo) {
        const ejercicios = await sequelize.models.Ejercicios_Maquinas.findAll({
            where: {
                idMaquina: id
            },
            include: [
                {
                    model: sequelize.models.Ejercicios,
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
                        // {
                        //     model: sequelize.models.Videos,
                        //     attributes: ['nombre', 'url']
                        // },
                    ]
                },
            ]
        });

        rdo.dataValues.ejercicios = ejercicios.map(e => {
            e.dataValues.Ejercicio.nombreZonaCuerpo = e.dataValues.Ejercicio.Cuerpo_Zona.nombre;
            e.dataValues.Ejercicio.nombreCategoria = e.dataValues.Ejercicio.Categoria_Ejercicio.nombre;
            delete e.dataValues.Ejercicio.Cuerpo_Zona;
            delete e.dataValues.Ejercicio.Categoria_Ejercicio;
            return e.dataValues
        })
        return rdo.dataValues
    } else {
        return { error: "No existe la maquina con el id especificado" }
    }
}

// obtener 0 a N maquinas, en funcion de 0 o mas filtros
const getMaquinasByFilters = async (body) => {
    const { dadosBaja, nombre, marca, peso } = body; // desestructuro lo que viene en el objeto del cuerpo de la solicitud

    const whereCondition = {}; // declaro un objeto vacio que va a almacenar las condiciones de los filtros dinamicamente

    if (!nombre && !marca && !peso && dadosBaja === 1) { // si viene sin filtros, devuelve el rdo de la ejecucion del getAll()
        return await getAll()
    }

    if (nombre) { // si hay un nombre, que almacene el filtro
        whereCondition.nombre = { [Op.like]: `%${nombre.toLowerCase()}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (marca) {
        whereCondition.marca = { [Op.like]: `%${marca.toLowerCase()}%` }
        console.log("marca parseado: ", marca.toLowerCase())
    }

    if (peso) {
        whereCondition.peso = { [Op.gte]: peso };
        console.log("peso mínimo: ", peso);
    }

    const maquinas = await sequelize.models.Maquinas.findAll({
        order: [['id', 'ASC']],
        where: {
            [Op.and]: [ // donde se cumplan las condiciones dinamicas
                whereCondition,
                {
                    [Op.or]: [
                        { esActivo: 1 },
                        dadosBaja === 0 && { esActivo: 0 }
                    ]
                }
            ]
        },
    });

    console.log("cant registros devueltos: ", maquinas.length);

    return maquinas.map(e => e.dataValues)
}

// servicio que me permite la creacion de una nueva maquina
const addMaquina = async (body, urlFoto) => {
    try {
        const maquinaACrear = await sequelize.models.Maquinas.create({
            nombre: body.nombre.toLowerCase(),
            peso: body.peso,
            esActivo: 1,
            urlFoto: urlFoto,
            marca: body.marca.toLowerCase()
        })

        console.log("maquina siendo creada en el services: ", maquinaACrear)
        return maquinaACrear.dataValues;
    } catch (error) {
        console.log("ERROR CREANDO LA MAQUINITA: ", error)
    }
}

// borrar una maquina, en este caso, usaremos baja logica, es decir, no se borra totalmente de la BD, solo no lo muestra
const deleteMachine = async (id) => {
    const machineToDelete = await sequelize.models.Maquinas.findOne({ // buscar usuario activo, y que tenga el dni ingresado por parametro
        where: {
            esActivo: 1,
            id: id
        }
    })

    if (!machineToDelete) { // si no hay maquina que cumpla con lo anterior, devuelve el error
        return { error: 'No existe la maquina que se desea borrar' }
    }

    machineToDelete.esActivo = 0; // si lo hay, actualiza su estado de actividad a 0, dandolo de baja de forma logica
    await machineToDelete.save(); // guarda el cambio del atributo
    return { message: 'Maquina borrada exitosamente' } // devuelve el mensaje de que se borro exitosamente
}

// reactivar un usuario dado de baja, actualizando su atributo esActivo, de 0 a 1
const activateMachine = async (id) => {
    const machineToActivate = await sequelize.models.Maquinas.findOne({ // buscar maquina inactiva, y que tenga el id ingresado por parametro
        where: {
            esActivo: 0,
            id: id
        }
    })

    if (!machineToActivate) { // si no encuentra la maquina, que devuelva este error
        return { error: 'Esta maquina ya esta activa o no existe la  maquina a activar' }
    }

    machineToActivate.esActivo = 1; // si lo encuentra, que actualice su estado de actividad a 1
    await machineToActivate.save(); // guarda el cambio
    return { message: 'Maquina reactivada exitosamente' } // devuelve el mensaje de que se activo correctamente
}

// actualizar la maquina
const updateMachine = async (body) => {
    try {
        const rdo = await sequelize.models.Maquinas.findOne({ // busca una maquina con el dni indicado
            where: {
                id: body.id
            },
        })

        console.log("rdo al hallar maquina a actualizar: ", rdo.dataValues)

        if (!rdo) { // si no lo encuentra, devuelve un error
            return { error: 'Error al actualizar la maquina.' };
        }

        // si lo encuentra, lleva a cabo los cambios pertinentes
        rdo.nombre = body.nombre.toLowerCase();
        rdo.marca = body.marca.toLowerCase();
        rdo.peso = body.peso;

        await rdo.save(); // guarda el resultado
        return rdo; // devuelve la maquina actualizado
    } catch (error) {
        console.log("ERROR: ", error)
    }
}

const maquinasServices = {
    getAll,
    getMaquinasByFilters,
    getMaquinaById,
    addMaquina,
    deleteMachine,
    activateMachine,
    updateMachine
};

export { maquinasServices }