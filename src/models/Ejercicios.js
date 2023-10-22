import { DataTypes } from "sequelize";

const ejerciciosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idZonaCuerpo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idCategoriaEjercicio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idVideo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idTipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
};

const ejerciciosMethods = {
    timestamps: false
};

const EjerciciosModel = {
    ejerciciosAttributes,
    ejerciciosMethods
};

export { EjerciciosModel }