import { DataTypes } from "sequelize";

const planesUsuariosAttributes = {
    Planeid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idPlan' // Nombre de la columna en la base de datos
    },
    Usuariodni: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'dniUsuario' // Nombre de la columna en la base de datos
    }
};

const planesUsuariosMethods = {};

const PlanesUsuariosModel = {
    planesUsuariosAttributes,
    planesUsuariosMethods
};

export { PlanesUsuariosModel }