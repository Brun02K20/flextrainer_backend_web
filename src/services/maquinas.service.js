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
    const { dadosBaja, nombre } = body; // desestructuro lo que viene en el objeto del cuerpo de la solicitud
    const whereCondition = {}; // declaro un objeto vacio que va a almacenar las condiciones de los filtros dinamicamente

    if (!nombre && dadosBaja === 1) { // si viene sin filtros, devuelve el rdo de la ejecucion del getAll()
        return await getAll()
    }

    if (nombre) { // si hay un nombre, que almacene el filtro
        whereCondition.nombre = { [Op.like]: `%${nombre.toLowerCase()}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
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

const maquinasServices = {
    getAll,
    getMaquinasByFilters,
    getMaquinaById
};

export { maquinasServices }