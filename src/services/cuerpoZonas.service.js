import sequelize from "../databases/databases.js";

const getAll = async () => {
    const rdo = await sequelize.models.Cuerpo_Zonas.findAll({ order: [['id', 'ASC']] })
    return rdo.map(e => e.dataValues)
}

const cuerpoZonasServices = {
    getAll
}

export { cuerpoZonasServices }