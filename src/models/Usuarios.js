import { DataTypes } from "sequelize"; // importo los tipos de datos existentes, desde el framework de ORM

// un modelo, siempre se va a componer de la misma forma: atributos, y metodos, que son los objetos que se definen
// a continuacion, esta logica aplica a todos los modelos, por lo tanto, solo documento este
const usuariosAttributes = {
    dni: { // declaro un atributo dni, que va a ser la PK, sin autoincremento
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    nombre: { // declaro un atributo nombre, que va a ser STRING, NOT NULL
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: { // declaro un atributo apellido, que va a ser STRING, NOT NULL
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaNacimiento: { // declaro un atributo fecha, que va a ser DATEONLY, es decir, no incluye una hora, NOT NULL
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    numeroTelefono: { // declaro un atributo numeroTelefono, que va a ser STRING, NOT NULL, le puse STRING, porque capaz el usuario ingresa +54....
        type: DataTypes.STRING,
        allowNull: false
    },
    correoElectronico: { // declaro un atributo correoElectronico, que va a ser STRING, NOT NULL,
        type: DataTypes.STRING,
        allowNull: false
    },
    esActivo: { // declaro un atributo, es activo, NOT NULL, INT, que puede valer o 0, o 1, ningun otro valor, va a funcionar como boolean
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idRol: { // declaro un atributo idRol, que si puede ser NULL, INTEGER, la declaracion del hecho de que es una FK, esta en el databases.js
        type: DataTypes.INTEGER,
        allowNull: true
    },
    dniEntrenador: { // declaro un atributo dniEntrenador, que si puede ser NULL, INTEGER, la declaracion del hecho de que es una FK, esta en el databases.js
        type: DataTypes.INTEGER,
        allowNull: true
    },
    password: { // declaro un atributo password, que va a ser STRING, NOT NULL
        type: DataTypes.STRING,
        allowNull: false
    },
    genero: { // declaro un atributo genero, que va a ser STRING, NOT NULL
        type: DataTypes.STRING,
        allowNull: false
    }
};

// esto copiar y pegar, es siempre igual
const usuariosMethods = {
    timestamps: false
};

// creo el modelo y lo exporto
const UsuariosModel = {
    usuariosAttributes,
    usuariosMethods
};

export { UsuariosModel }