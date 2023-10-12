import { DataTypes } from "sequelize";

const cuerpoZonasAttributes = {
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

const cuerpoZonasMethods = {
    timestamps: false
};

const CuerpoZonasModel = {
    cuerpoZonasAttributes,
    cuerpoZonasMethods
};

export { CuerpoZonasModel }