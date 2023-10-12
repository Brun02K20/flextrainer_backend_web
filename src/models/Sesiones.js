import { DataTypes } from "sequelize";

const sesionesAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idPlan: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

const sesionesMethods = {
    timestamps: false
};

const SesionesModel = {
    sesionesAttributes,
    sesionesMethods
};

export { SesionesModel }