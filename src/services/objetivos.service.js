import sequelize from "../databases/databases.js";

const getAll = async () => {
    const rdo = await sequelize.models.Objetivos.findAll()
    return rdo.map(e => e.dataValues)
}

const objetivosServices = {
    getAll
}

export { objetivosServices }