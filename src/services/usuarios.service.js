import sequelize from "../databases/databases.js"; // importo las definiciones de los modelos
import { Op } from "sequelize"; // importo las funcionalidades de operaciones de bases de datos
import bcrypt from 'bcrypt'; // importo bcrypt para el hasheo de contraseñas
import { enviarCorreo } from "../email.js";

// Los servicios, para cada modelo, en escencia, son la capa de la logica de negocio de la aplicacion. 
// Como por ejemplo, buscar, crear, modificar, borrar, calcular, encriptar, y demas. 
// Estos se van a conectar a la BD para llevar a cabo dichos servicios, modificando la misma.
// Todos los servicios en todos los modelos, son escencialmente esto.

// obtener todos los usuarios, sin filtros
const getAll = async () => {
    const rdo = await sequelize.models.Usuarios.findAll({
        include: [ // incluir el nombre del rol del usuario
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            },
            {
                model: sequelize.models.Usuarios, // Incluye el modelo Usuarios
                as: 'Usuario', // Utiliza el alias definido en la asociación
                attributes: {
                    exclude: ['password']
                },
            }
        ],
        where: { // que sea activo en la BD
            esActivo: 1
        },
        attributes: { // no devolver el password, por buenas practicas de seguridad
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

// crear un nuevo usuario, registrar un nuevo usuario
const insertUser = async (user) => {
    try {
        const haseado = await bcrypt.hash(user.password, 10); // hashear el password
        console.log("HASHEADO: ", haseado)

        const rdo = await sequelize.models.Usuarios.create({ // crear el usuario
            dni: user.dni,
            nombre: user.nombre.toLowerCase(),
            apellido: user.apellido.toLowerCase(),
            fechaNacimiento: user.fechaNacimiento,
            numeroTelefono: user.numeroTelefono,
            correoElectronico: user.correoElectronico,
            esActivo: 1,
            idRol: 4,
            dniEntrenador: null,
            password: haseado,
            genero: user.genero
        });

        return rdo.dataValues; // devolver el resultado
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') { // si viola las restricciones UNIQUE de mail o telefono
            // Manejar el error de restricción única
            return { error: 'Ya existe un usuario con ese dni, correo electrónico o número de teléfono.' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL CREAR USUARIO: ", error);
            return { error: 'Error al crear el usuario.' };
        }
    }
}

// login del usuario
const login = async (user) => {
    try {
        const rdo = await sequelize.models.Usuarios.findOne({ // busca un usuario con el dni ingresado
            where: {
                dni: user.dni
            }
        });

        if (rdo) { // si lo encuentra, compara el password ingresado con el de la BD
            const same = await bcrypt.compare(user.password, rdo.dataValues.password)
            console.log("same: ", same)
            if (same) { // si son iguales, devuelve el usuario
                delete rdo.dataValues.password;
                return rdo.dataValues;
                // si no, se ejecuta el error correspondiente
            } else {
                return { error: 'No existe usuario con los datos ingresados' }
            }
        } else {
            return { error: 'No existe usuario con los datos ingresados' }
        }
    } catch (error) {
        console.error('Error en la comparación de contraseñas:', error);
        return { error: 'Error en la autenticación' };
    }
}

// obtener usuario por su PK, en este caso, el dni
const getUserByDni = async (dni) => {
    const rdo = await sequelize.models.Usuarios.findOne({ // busca un usuario
        include: [ // incluir el nombre del rol que tiene el usuario
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            }
        ],
        where: {
            dni: dni // donde el dni sea el mismo que es pasado por parametro
        },
        attributes: {
            exclude: ['password'] // no devuelve el password por buenas practicas de seguridad
        }
    })

    if (rdo) { // si encuentra a un usuario con ese dni, devuelve sus datos, si no, devuelve un error
        rdo.nombreRol = rdo.Role ? rdo.Role.nombre : null;
        delete rdo.Role;
        return rdo.dataValues;
    } else {
        return { error: 'No existe usuario con este dni' }
    }
}

// obtener usurios en funcion de 0 o varios filtros
const getUserByFilters = async (body) => {
    const { dni, nombre, apellido, genero, idRol, dadosBaja } = body; // desestructuro lo que viene en el objeto del cuerpo de la solicitud
    const whereCondition = {}; // declaro un objeto vacio que va a almacenar las condiciones de los filtros dinamicamente
    if (!dni && !nombre && !apellido && !genero && !idRol && dadosBaja === 1) { // si viene sin filtros, devuelve el rdo de la ejecucion del getAll()
        return await getAll()
    }

    if (dni) { // si hay un dni, que almacene el filtro
        whereCondition.dni = { [Op.like]: `%${dni}%` }
    };


    if (nombre) { // si hay un nombre, que almacene el filtro
        whereCondition.nombre = { [Op.like]: `%${nombre.toLowerCase()}%` }
        console.log("nombre parseado: ", nombre.toLowerCase())
    }

    if (apellido) { // si hay un apellido, que almacene el filtro
        whereCondition.apellido = { [Op.like]: `%${apellido.toLowerCase()}%` }
        console.log("apellido parseado: ", apellido.toLowerCase())
    }

    if (genero) { // si hay un genero, que almacene el filtro
        whereCondition.genero = genero
    }

    if (idRol) { // si hay un rol que almacene el filtro
        whereCondition.idRol = idRol
    }

    const usuarios = await sequelize.models.Usuarios.findAll({
        attributes: {
            exclude: ['password'] // excluir el password de los usuarios
        },
        where: {
            [Op.and]: [ // donde se cumplan las condiciones dinamicas
                whereCondition,
                {
                    [Op.or]: [
                        { esActivo: 1 },
                        dadosBaja === 0 && { esActivo: 0 }
                    ]
                }
            ]
        },
        include: [ // incluyendo los nombres de los roles de los usuairos
            {
                model: sequelize.models.Roles,
                attributes: ['nombre']
            },
            {
                model: sequelize.models.Usuarios, // Incluye el modelo Usuarios
                as: 'Usuario', // Utiliza el alias definido en la asociación
                attributes: {
                    exclude: ['password']
                },
            }
        ],
    })

    console.log("cant registros devueltos: ", usuarios.length)

    return usuarios.map(e => { // devuelve a los usuarios que cumplan con las condiciones
        const user = e.dataValues;
        if (user.Role && user.Role.nombre) {
            user.nombreRol = user.Role.nombre;
            delete user.Role; // Eliminamos la propiedad Role original
        }
        return user
    })
}

// borrar un usuario, en este caso, usaremos baja logica, es decir, no se borra totalmente de la BD, solo no lo muestra
const deleteUser = async (dni) => {
    const userToDelete = await sequelize.models.Usuarios.findOne({ // buscar usuario activo, y que tenga el dni ingresado por parametro
        where: {
            esActivo: 1,
            dni: dni
        }
    })

    if (!userToDelete) { // si no hay usuario que cumpla con lo anterior, devuelve el error
        return { error: 'No existe el usuario que se desea borrar' }
    }

    await sequelize.models.Planes_Alumnos.destroy({
        where: {
            Usuariodni: userToDelete.dni
        }
    })

    userToDelete.esActivo = 0; // si lo hay, actualiza su estado de actividad a 0, dandolo de baja de forma logica
    userToDelete.dniEntrenador = null;
    await userToDelete.save(); // guarda el cambio del atributo
    return { message: 'Usuario borrado exitosamente' } // devuelve el mensaje de que se borro exitosamente
}

// reactivar un usuario dado de baja, actualizando su atributo esActivo, de 0 a 1
const activateUser = async (dni) => {
    const userToActivate = await sequelize.models.Usuarios.findOne({ // buscar usuario inactivo, y que tenga el dni ingresado por parametro
        where: {
            esActivo: 0,
            dni: dni
        }
    })

    console.log("usuario a activar: ", userToActivate)

    if (!userToActivate) { // si no encuentra el usuario, que devuelva este error
        return { error: 'Este usuario ya esta activo o no existe el usuario a activar' }
    }

    userToActivate.esActivo = 1; // si lo encuentra, que actualice su estado de actividad a 1
    await userToActivate.save(); // guarda el cambio
    return { message: 'Usuario reactivado exitosamente' } // devuelve el mensaje de que se activo correctamente
}

// asignar un rol a un usuairo cuyo rol sea el nro 4: Sin Asignar
const asignarRolYProfe = async (bodyParams) => {
    const { dni, rol, entrenador } = bodyParams; // desestructurar lo que viene en el body de la peticion

    const rdo = await sequelize.models.Usuarios.findOne({ // buscar usuario que tenga el dni pasado por parametro
        where: {
            dni: dni
        }
    })

    if (!rdo) { // si no existe usuario, devolver el error
        return { error: 'No existe el usuario con este dni' }
    }

    if (entrenador) { // si el body, tiene un atributo entrenador, que asigne el dniEntrenador del usuario, como el valor de entrenador, pasado por parametro
        rdo.dniEntrenador = entrenador

        const trainer = await sequelize.models.Usuarios.findOne({ where: { dni: entrenador } })

        if (rdo.correoElectronico === "bvirinni@gmail.com") {
            await enviarCorreo(rdo.correoElectronico, "ASIGNACIÓN DE ENTRENADOR", `Hola ${rdo.nombre} ${rdo.apellido}, te asignaron un nuevo entrenador :D. Se llama: ${trainer.nombre} ${trainer.apellido}.`, "info@flextrainer.com.ar", "Bruno2023!")
        }
    }
    rdo.idRol = rol // asignar el rol al usuario
    await rdo.save() // guardar los cambios

    return rdo.dataValues; // devolver los datos del usuario actualizado
}

const asignarSoloProfe = async (bodyParams) => {
    const rdo = await sequelize.models.Usuarios.findOne({ // buscar usuario que tenga el dni pasado por parametro
        where: {
            dni: bodyParams.dniUser
        }
    })

    if (!rdo) { // si no existe usuario, devolver el error
        return { error: 'No existe el usuario con este dni' }
    }

    rdo.dniEntrenador = bodyParams.entrenador;


    await rdo.save() // guardar los cambios

    const trainer = await sequelize.models.Usuarios.findOne({ where: { dni: bodyParams.entrenador } })

    if (rdo.correoElectronico === "bvirinni@gmail.com") {
        await enviarCorreo(rdo.correoElectronico, "ASIGNACIÓN DE ENTRENADOR", `Hola ${rdo.nombre} ${rdo.apellido}, te asignaron un nuevo entrenador :D. Se llama: ${trainer.nombre} ${trainer.apellido}.`, "info@flextrainer.com.ar", "Bruno2023!")
    }
    return rdo.dataValues; // devolver los datos del usuario actualizado
}

// actualizar el usuario
const updateUser = async (body) => {
    try {
        const rdo = await sequelize.models.Usuarios.findOne({ // busca un usuario con el dni indicado
            where: {
                dni: body.dniOriginal
            },
            attributes: {
                exclude: ['password']
            }
        })

        console.log("rdo al hallar user a actualizar: ", rdo.dataValues)

        if (!rdo) { // si no lo encuentra, devuelve un error
            return { error: 'Error al actualizar el usuario.' };
        }

        console.log("dni modificado: ", body.dni)

        // si lo encuentra, lleva a cabo los cambios pertinentes
        const dniMod = body.dni
        console.log("dniMod: ", dniMod)
        rdo.dni = dniMod;
        rdo.nombre = body.nombre.toLowerCase();
        rdo.apellido = body.apellido.toLowerCase();
        rdo.fechaNacimiento = body.fechaNacimiento;
        rdo.genero = body.genero;
        rdo.correoElectronico = body.correoElectronico;
        rdo.numeroTelefono = body.numeroTelefono;

        console.log("nuevo dni: ", rdo.dni);

        await rdo.save(); // guarda el resultado
        return rdo; // devuelve el usuario actualizado
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Manejar el error de restricción única, de mail o de telefono
            return { error: 'Ya existe un usuario con ese dni, correo electrónico o número de teléfono.' };
        } else {
            // Manejar otros errores
            console.log("ERROR AL ACTUALIZAR USUARIO: ", error);
            return { error: 'Error al actualizar el usuario.' };
        }
    }
}


// servicios de soporte
// traer a todos los entrenadores activos para la asignacion de profesor a un alumno.
const getCoachesActivos = async () => {
    const rdo = await sequelize.models.Usuarios.findAll({
        where: {
            idRol: 1,
            esActivo: 1
        }
    });
    return rdo.map(e => e.dataValues)
};

/// obtener un usuario en base a dni, mail, y celular
const getUserByDniMailandPhone = async (dni, mail, phone) => {
    const rdo = await sequelize.models.Usuarios.findOne({
        where: {
            dni: dni,
            numeroTelefono: phone,
            correoElectronico: mail
        },
        attributes: {
            exclude: ["password"]
        }
    })

    if (!rdo) {
        return { error: "No existe una cuenta con la información ingresada." }
    }

    return rdo.dataValues
}

// servicio para la actualizacion de la contraseña
const updatePassword = async (dni, password) => {
    const usuarioAActualizar = await sequelize.models.Usuarios.findOne({
        where: {
            dni: dni
        }
    })

    console.log("usuario hallado: ", usuarioAActualizar)

    const same = await bcrypt.compare(password, usuarioAActualizar.dataValues.password)
    console.log("same: ", same)
    if (!same) { // si son iguales, devuelve el usuario
        console.log("nueva password: ", password)
        const haseado = await bcrypt.hash(password, 10); // hashear el password
        usuarioAActualizar.password = haseado;
        await usuarioAActualizar.save()

        delete usuarioAActualizar.dataValues.password;
        return usuarioAActualizar.dataValues;
        // si no, se ejecuta el error correspondiente
    } else {
        return { esIgual: 'La nueva contraseña no puede ser igual a la anterior' }
    }
}


// declaro los servicios a exportar
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
    asignarSoloProfe,
    getUserByDniMailandPhone,
    updatePassword
}

export { usuariosServices }