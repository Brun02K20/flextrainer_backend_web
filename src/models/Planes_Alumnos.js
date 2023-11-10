import { DataTypes } from "sequelize";

const planesAlumnosAttributes = {
    Usuariodni: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'dniAlumno'
    },
    Planeid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'idPlan'
    },
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true
    }
};

const planesAlumnosMethods = {
    timestamps: false
};

const PlanesAlumnosModel = {
    planesAlumnosAttributes,
    planesAlumnosMethods
};

export { PlanesAlumnosModel }