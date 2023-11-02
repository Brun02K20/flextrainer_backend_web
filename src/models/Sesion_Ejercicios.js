import { DataTypes } from "sequelize";

const sesionEjerciciosAttributes = {
    Planeid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idPlan'
    },
    Ejercicioid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idEjercicio'
    },
    Sesioneid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idSesion'
    },
    tiempo: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    series: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    repeticiones: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    descanso: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
};

const sesionEjerciciosMethods = {
    timestamps: false
};

const SesionEjerciciosModel = {
    sesionEjerciciosAttributes,
    sesionEjerciciosMethods
};

export { SesionEjerciciosModel }