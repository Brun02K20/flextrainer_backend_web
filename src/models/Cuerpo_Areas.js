import { DataTypes } from "sequelize";

const cuerpoAreasAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idEjercicio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

const cuerpoAreasMethods = {
    timestamps: false
};

const CuerpoAreasModel = {
    cuerpoAreasAttributes,
    cuerpoAreasMethods
};

export { CuerpoAreasModel }