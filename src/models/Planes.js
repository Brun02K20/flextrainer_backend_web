import { DataTypes } from "sequelize";

const planesAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idObjetivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    esActivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dniProfesor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true
    }
};

const planesMethods = {
    timestamps: false
};

const PlanesModel = {
    planesAttributes,
    planesMethods
};

export { PlanesModel }