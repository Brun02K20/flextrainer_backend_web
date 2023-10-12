import { Sequelize } from "sequelize"; // importando el framework de ORM

// importando los modelos (las entidades del negocio)
import { UsuariosModel } from "../models/Usuarios.js";
import { RolesModel } from "../models/Roles.js";
import { PlanesModel } from "../models/Planes.js";
import { PlanesAlumnosModel } from "../models/Planes_Alumnos.js";
import { SesionesModel } from "../models/Sesiones.js";
import { SesionEjerciciosModel } from "../models/Sesion_Ejercicios.js";
import { EjerciciosModel } from "../models/Ejercicios.js";
import { CategoriaEjerciciosModel } from "../models/Categoria_Ejercicios.js";
import { MaquinasModel } from "../models/Maquinas.js";
import { CuerpoZonasModel } from "../models/Cuerpo_Zonas.js";
import { VideosModel } from "../models/Videos.js";
import { ObjetivosModel } from "../models/Objetivos.js";


// creando DB usando dialecto MySQL
const sequelize = new Sequelize({
    dialect: "mysql",
    host: "200.80.43.108",
    username: "virinnij_Brunolaszlo",
    password: "Brun02K23.",
    database: "virinnij_flextrainer"
});

// definiendo los modelos de negocio a fin de poder crear servicios CRUD para los mismos
sequelize.define('Usuarios', UsuariosModel.usuariosAttributes, UsuariosModel.usuariosMethods);
sequelize.define('Roles', RolesModel.rolesAttributes, RolesModel.rolesMethods);
sequelize.define('Planes', PlanesModel.planesAttributes, PlanesModel.planesMethods);
sequelize.define('Planes_Alumnos', PlanesAlumnosModel.planesAlumnosAttributes, PlanesAlumnosModel.planesAlumnosMethods);
sequelize.define('Sesiones', SesionesModel.sesionesAttributes, SesionesModel.sesionesMethods);
sequelize.define('Sesion_Ejercicios', SesionEjerciciosModel.sesionEjerciciosAttributes, SesionEjerciciosModel.sesionEjerciciosMethods);
sequelize.define('Ejercicios', EjerciciosModel.ejerciciosAttributes, EjerciciosModel.ejerciciosMethods);
sequelize.define('Categoria_Ejercicios', CategoriaEjerciciosModel.categoriaEjerciciosAttributes, CategoriaEjerciciosModel.categoriaEjerciciosMethods);
sequelize.define('Cuerpo_Zonas', CuerpoZonasModel.cuerpoZonasAttributes, CuerpoZonasModel.cuerpoZonasMethods);
sequelize.define('Maquinas', MaquinasModel.maquinasAttributes, MaquinasModel.maquinasMethods);
sequelize.define('Videos', VideosModel.videosAttributes, VideosModel.videosMethods);
sequelize.define('Objetivos', ObjetivosModel.objetivosAttributes, ObjetivosModel.objetivosMethods);

// DECLARACIONES DE FKs: 
// FK de los usuarios: seran 2, una de autoreferencia (dniEntrenador), y la otra apuntara al id de la tabla de Roles
sequelize.models.Usuarios.belongsTo(sequelize.models.Roles, { foreignKey: 'idRol' });
sequelize.models.Usuarios.belongsTo(sequelize.models.Usuarios, { foreignKey: 'dniEntrenador' });

// FKs de la tabla de Planes:
sequelize.models.Planes.belongsTo(sequelize.models.Usuarios, { foreignKey: 'dniProfesor' });
sequelize.models.Planes.belongsTo(sequelize.models.Objetivos, { foreignKey: 'idObjetivo' });

// Relación N a N entre Alumnos y Planes a través de PlanesAlumnos
sequelize.models.Usuarios.belongsToMany(sequelize.models.Planes, { through: sequelize.models.Planes_Alumnos, foreignKey: 'dniAlumno' });
sequelize.models.Planes.belongsToMany(sequelize.models.Usuarios, { through: sequelize.models.Planes_Alumnos, foreignKey: 'idPlan' });

// FK de la tabla sesiones que apunta al id de la tabla planes
sequelize.models.Sesiones.belongsTo(sequelize.models.Planes, { foreignKey: 'idPlan' });

// FKs de la tabla de ejercicios, las cuales son todas relaciones 1 a 1 en la base de datos: 
sequelize.models.Ejercicios.belongsTo(sequelize.models.Categoria_Ejercicios, { foreignKey: 'idCategoriaEjercicio' });
sequelize.models.Ejercicios.belongsTo(sequelize.models.Cuerpo_Zonas, { foreignKey: 'idZonaCuerpo' });
sequelize.models.Ejercicios.belongsTo(sequelize.models.Maquinas, { foreignKey: 'idMaquina' });
sequelize.models.Ejercicios.belongsTo(sequelize.models.Videos, { foreignKey: 'idVideo' });

// FKS de la tabla triple Sesion_Ejercicios
sequelize.models.Ejercicios.belongsToMany(sequelize.models.Sesiones, { through: sequelize.models.Sesion_Ejercicios, foreignKey: 'idEjercicio' });
sequelize.models.Sesiones.belongsToMany(sequelize.models.Ejercicios, { through: sequelize.models.Sesion_Ejercicios, foreignKey: 'idSesion' });

sequelize.models.Ejercicios.belongsToMany(sequelize.models.Planes, { through: sequelize.models.Sesion_Ejercicios, foreignKey: 'idEjercicio' });
sequelize.models.Planes.belongsToMany(sequelize.models.Ejercicios, { through: sequelize.models.Sesion_Ejercicios, foreignKey: 'idPlan' });

sequelize.models.Sesiones.belongsToMany(sequelize.models.Planes, { through: sequelize.models.Sesion_Ejercicios, foreignKey: 'idSesion' });
sequelize.models.Planes.belongsToMany(sequelize.models.Sesiones, { through: sequelize.models.Sesion_Ejercicios, foreignKey: 'idPlan' });


// conexion a la BD
try {
    // await sequelize.sync();
    console.log("levanto la base de datos")
} catch (error) {
    console.log("Error en la conexion a la BD:", error.message);
}

// exportando los modelos para usarlos en los servicios
export default sequelize;