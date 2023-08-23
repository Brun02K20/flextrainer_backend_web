import { DataTypes } from "sequelize";

const usuariosAttributes = {
    dni: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaDeNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    numeroTelefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idRol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dniCliente: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dniEntrenador: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

};

const usuariosMethods = {
    timestamps: false
};

const UsuariosModel = {
    usuariosAttributes,
    usuariosMethods
};

export { UsuariosModel }