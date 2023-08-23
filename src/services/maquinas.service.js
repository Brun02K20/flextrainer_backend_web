import sequelize from "../databases/databases.js";

const getAll = async () => {
    const rdo = await sequelize.models.Maquinas.findAll({
        order: [['id', 'ASC']]
    })
    return rdo.map(r => r.dataValues)
}

const maquinasServices = {
    getAll
}

export { maquinasServices }