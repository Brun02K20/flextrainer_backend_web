import sequelize from "../databases/databases.js";

const getAll = async () => {
    const allvideos = await sequelize.models.Videos.findAll({
        order: [['id', 'ASC']]
    })
    return allvideos.map(r => r.dataValues)
}

const videosServices = {
    getAll
}

export { videosServices }
