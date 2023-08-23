import sequelize from "../databases/databases.js";

const getAll = async () => {
    const rdo = await sequelize.models.Ejercicios.findAll({
        order: [['id', 'ASC']]
    })
    return rdo.map(r => r.dataValues)
}

const ejerciciosServices = {
    getAll
}

export { ejerciciosServices }