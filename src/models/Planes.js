import { DataTypes } from "sequelize";

const planesAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false
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