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

const categoriaEjerciciosMethods = {
    timestamps: false
};

const CategoriaEjerciciosModel = {
    categoriaEjerciciosAttributes,
    categoriaEjerciciosMethods
};

export { CategoriaEjerciciosModel }