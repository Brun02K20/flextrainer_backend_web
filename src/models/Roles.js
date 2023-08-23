import { DataTypes } from "sequelize";

const rolesAttributes = {
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

const rolesMethods = {
    timestamps: false
};

const RolesModel = {
    rolesAttributes,
    rolesMethods
};

export { RolesModel }