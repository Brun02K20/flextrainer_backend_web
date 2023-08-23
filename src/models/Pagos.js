import { DataTypes } from "sequelize";

const pagosAttributes = {
    FechaPago: {
        type: DataTypes.DATEONLY,
        primaryKey: true
    },
    HoraPago: {
        type: DataTypes.TIME,
        primaryKey: true
    },
    dniCliente: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
};

const pagosMethods = {
    timestamps: false
};

const PagosModel = {
    pagosAttributes,
    pagosMethods
};

export { PagosModel }