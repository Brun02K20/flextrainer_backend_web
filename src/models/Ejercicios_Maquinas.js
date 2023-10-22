import { DataTypes } from "sequelize";

const ejerciciosMaquinasAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idEjercicio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idMaquina: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
};

const ejerciciosMaquinasMethods = {
    timestamps: false
};

const EjerciciosMaquinasModel = {
    ejerciciosMaquinasAttributes,
    ejerciciosMaquinasMethods
};

export { EjerciciosMaquinasModel }