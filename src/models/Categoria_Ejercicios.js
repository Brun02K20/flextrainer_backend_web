import { DataTypes } from "sequelize";

const categoriaEjerciciosAttributes = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tieneTiempo: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    tieneSeries: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    tieneRepeticiones: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    tieneDescanso: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
};

const categoriaEjerciciosMethods = {
    timestamps: false
};

const CategoriaEjerciciosModel = {
    categoriaEjerciciosAttributes,
    categoriaEjerciciosMethods
};

export { CategoriaEjerciciosModel }