import { DataTypes } from "sequelize";

const maquinasAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    peso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    esActivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    urlFoto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

const maquinasMethods = {
    timestamps: false
};

const MaquinasModel = {
    maquinasAttributes,
    maquinasMethods
};

export { MaquinasModel }