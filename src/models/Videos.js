import { DataTypes } from "sequelize";

const videosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

const videosMethods = {
    timestamps: false
};

const VideosModel = {
    videosAttributes,
    videosMethods
};

export { VideosModel }