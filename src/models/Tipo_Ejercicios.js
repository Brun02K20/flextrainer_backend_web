import { DataTypes } from "sequelize";

const tipoEjerciciosAttributes = {
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

const tipoEjerciciosMethods = {
    timestamps: false
};

const TipoEjerciciosModel = {
    tipoEjerciciosAttributes,
    tipoEjerciciosMethods
};

export { TipoEjerciciosModel }