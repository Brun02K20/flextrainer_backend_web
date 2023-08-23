import { DataTypes } from "sequelize";

const ejerciciosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idMaquina: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
};

const ejerciciosMethods = {
    timestamps: false
};

const EjerciciosModel = {
    ejerciciosAttributes,
    ejerciciosMethods
};

export { EjerciciosModel }