import sequelize from "../databases/databases.js";
import { Op } from "sequelize";
import bcrypt from 'bcrypt'

// anda
const getAll = async () => {
    const rdo = await sequelize.models.Usuarios.findAll({
        include: [
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            }
        ],
        where: {
            esActivo: 1
        },
        attributes: {
            exclude: ['password']
        }
    });

    console.log("cant registros devueltos: ", rdo.length)

    return rdo.map(e => {
        const user = e.dataValues;
        if (user.Role && user.Role.nombre) {
            user.nombreRol = user.Role.nombre;
            delete user.Role; // Eliminamos la propiedad Role original
        }
        return user
    })
}

// anda
const insertUser = async (user) => {
    try {
        const haseado = await bcrypt.hash(user.password, 10);
        console.log("HASHEADO: ", haseado)

        const rdo = await sequelize.models.Usuarios.create({
            dni: user.dni,
            nombre: user.nombre,
            apellido: user.apellido,
            fechaNacimiento: user.fechaNacimiento,
            numeroTelefono: user.numeroTelefono,
            correoElectronico: user.correoElectronico,
            esActivo: 1,
            idRol: 4,
            dniEntrenador: null,
            password: haseado,
            genero: user.genero
        });

        return rdo.dataValues;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Manejar el error de restricción única
            return { error: 'Ya existe un usuario con ese dni, correo electrónico o número de teléfono.' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR USUARIO: ", error);
            return { error: 'Error al crear el usuario.' };
        }
    }
}

// anda
const login = async (user) => {
    const rdo = await sequelize.models.Usuarios.findOne({
        where: {
            dni: user.dni
        }
    })

    console.log("averigua el dni: ", rdo)

    if (rdo) {
        const same = bcrypt.compare(user.password, rdo.password)
        if (same) {
            return rdo.dataValues;
        } else {
            return { error: 'No existe usuario con los datos ingresados' }
        }
    } else {
        return { error: 'No existe usuario con los datos ingresados' }
    }
}

// anda
const getUserByDni = async (dni) => {
    const rdo = await sequelize.models.Usuarios.findOne({
        include: [
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            }
        ],
        where: {
            dni: dni
        },
        attributes: {
            exclude: ['password']
        }
    })

    if (rdo) {
        rdo.nombreRol = rdo.Role ? rdo.Role.nombre : null;
        delete rdo.Role;
        return rdo.dataValues;
    } else {
        return { error: 'No existe usuario con este dni' }
    }
}

// 
const getUserByFilters = async (body) => {
    const { dni, nombre, apellido, genero, idRol, dadosBaja } = body;
    const whereCondition = {};
    if (!dni && !nombre && !apellido && !genero && !idRol && dadosBaja === 1) {
        return await getAll()
    }

    if (dni) {
        whereCondition.dni = { [Op.like]: `%${dni}%` }
    };


    if (nombre) {
        whereCondition.nombre = { [Op.like]: `%${nombre.toLowerCase()}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (apellido) {
        whereCondition.apellido = { [Op.like]: `%${apellido.toLowerCase()}%` }
        console.log("apellido parseado: ", apellido.toLowerCase())
    }

    if (genero) {
        whereCondition.genero = genero
    }

    if (idRol) {
        whereCondition.idRol = idRol
    }

    const usuarios = await sequelize.models.Usuarios.findAll({
        attributes: {
            exclude: ['password']
        },
        where: {
            [Op.and]: [
                whereCondition,
                {
                    [Op.or]: [
                        { esActivo: 1 },
                        dadosBaja === 0 && { esActivo: 0 } // Agregamos esta condición
                    ]
                }
            ]
        },
        include: [
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            }
        ],
    })

    console.log("cant registros devueltos: ", usuarios.length)

    return usuarios.map(e => {
        const user = e.dataValues;
        if (user.Role && user.Role.nombre) {
            user.nombreRol = user.Role.nombre;
            delete user.Role; // Eliminamos la propiedad Role original
        }
        return user
    })
}

//
const deleteUser = async (dni) => {
    const userToDelete = await sequelize.models.Usuarios.findOne({
        where: {
            esActivo: 1,
            dni: dni
        }
    })

    if (!userToDelete) {
        return { error: 'No existe el usuario que se desea borrar' }
    }

    userToDelete.esActivo = 0;
    await userToDelete.save();
    return { message: 'Usuario borrado exitosamente' }
}


const activateUser = async (dni) => {
    const userToActivate = await sequelize.models.Usuarios.findOne({
        where: {
            esActivo: 0,
            dni: dni
        }
    })

    console.log("usuario a activar: ", userToActivate)

    if (!userToActivate) {
        return { error: 'Este usuario ya esta activo' }
    }

    userToActivate.esActivo = 1;
    await userToActivate.save();
    return { message: 'Usuario reactivado exitosamente' }
}

//
const asignarRolYProfe = async (bodyParams) => {

    const { dni, rol, entrenador } = bodyParams;

    const rdo = await sequelize.models.Usuarios.findOne({
        where: {
            dni: dni
        }
    })

    if (!rdo) {
        return { error: 'No existe el usuario con este dni' }
    }

    if (entrenador) {
        rdo.dniEntrenador = entrenador
    }
    rdo.idRol = rol
    await rdo.save()

    return rdo.dataValues;
}

const updateUser = async (body) => {
    try {
        const rdo = await sequelize.models.Usuarios.findOne({
            where: {
                dni: body.dniOriginal
            }
        })

        console.log("rdo al hallar user a actualizar: ", rdo.dataValues)

        if (!rdo) {
            return { error: 'Error al actualizar el usuario.' };
        }

        console.log("dni modificado: ", body.dni)

        const dniMod = body.dni
        console.log("dniMod: ", dniMod)
        rdo.dni = dniMod;
        rdo.nombre = body.nombre;
        rdo.apellido = body.apellido;
        rdo.fechaNacimiento = body.fechaNacimiento;
        rdo.genero = body.genero;
        rdo.correoElectronico = body.correoElectronico;
        rdo.numeroTelefono = body.numeroTelefono;

        console.log("nuevo dni: ", rdo.dni);

        await rdo.save();
        return rdo.dataValues;
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Manejar el error de restricción única
            return { error: 'Ya existe un usuario con ese dni, correo electrónico o número de teléfono.' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL ACTUALIZAR USUARIO: ", error);
            return { error: 'Error al actualizar el usuario.' };
        }
    }
}


// servicios de soporte
// 1. traer a todos los entrenadores activos para la asignacion de profesor a un alumno.
const getCoachesActivos = async () => {
    const rdo = await sequelize.models.Usuarios.findAll({
        where: {
            idRol: 1,
            esActivo: 1
        }
    });
    return rdo.map(e => e.dataValues)
};


const usuariosServices = {
    getAll,
    insertUser,
    login,
    getUserByDni,
    getUserByFilters,
    deleteUser,
    asignarRolYProfe,
    updateUser,
    activateUser,

    getCoachesActivos,
}

export { usuariosServices }