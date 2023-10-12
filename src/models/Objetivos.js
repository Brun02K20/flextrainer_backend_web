import { DataTypes } from "sequelize";

const objetivosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
};

const objetivosMethods = {
    timestamps: false
};

const ObjetivosModel = {
    objetivosAttributes,
    objetivosMethods
};

export { ObjetivosModel }