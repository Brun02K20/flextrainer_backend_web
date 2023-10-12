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
};

const sesionEjerciciosMethods = {
    timestamps: false
};

const SesionEjerciciosModel = {
    sesionEjerciciosAttributes,
    sesionEjerciciosMethods
};

export { SesionEjerciciosModel }