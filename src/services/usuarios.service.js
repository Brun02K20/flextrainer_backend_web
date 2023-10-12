import sequelize from "../databases/databases.js";

const getAll = async () => {
    const rdo = await sequelize.models.Usuarios.findAll({
        include: [
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            }
        ]
    })
    return rdo.map(e => e.dataValues)
}

const usuariosServices = {
    getAll
}

export { usuariosServices }