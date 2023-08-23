import { Sequelize } from "sequelize";

// importando los modelos
import { CuerpoAreasModel } from "../models/Cuerpo_Areas.js";
import { EjerciciosModel } from "../models/Ejercicios.js";
import { MaquinasModel } from "../models/Maquinas.js";
import { PagosModel } from "../models/Pagos.js";
import { PlanesUsuariosModel } from "../models/Planes_Usuarios.js";
import { PlanesModel } from "../models/Planes.js";
import { RolesModel } from "../models/Roles.js";
import { UsuariosModel } from "../models/Usuarios.js";
import { VideosModel } from "../models/Videos.js";

// creando DB usando dialecto sqlite, que despues debe ser cambiado a mySQL
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: './flexTrainer.db'
});

// definicion de los modelos
sequelize.define('CuerpoAreas', CuerpoAreasModel.cuerpoAreasAttributes, CuerpoAreasModel.cuerpoAreasMethods);
sequelize.define('Ejercicios', EjerciciosModel.ejerciciosAttributes, EjerciciosModel.ejerciciosMethods);
sequelize.define('Maquinas', MaquinasModel.maquinasAttributes, MaquinasModel.maquinasMethods);
sequelize.define('Pagos', PagosModel.pagosAttributes, PagosModel.pagosMethods);
sequelize.define('PlanesUsuarios', PlanesUsuariosModel.planesUsuariosAttributes, PlanesUsuariosModel.planesUsuariosMethods);
sequelize.define('Planes', PlanesModel.planesAttributes, PlanesModel.planesMethods);
sequelize.define('Roles', RolesModel.rolesAttributes, RolesModel.rolesMethods);
sequelize.define('Usuarios', UsuariosModel.usuariosAttributes, UsuariosModel.usuariosMethods);
sequelize.define('Videos', VideosModel.videosAttributes, VideosModel.videosMethods);

// definiciones de las relaciones entre tablas

// definiciones de Fks de la tabla de usuarios:
sequelize.models.Usuarios.belongsTo(sequelize.models.Roles, { foreignKey: 'idRol' });
sequelize.models.Usuarios.belongsTo(sequelize.models.Usuarios, { foreignKey: 'dniCliente', as: 'cliente' });
sequelize.models.Usuarios.belongsTo(sequelize.models.Usuarios, { foreignKey: 'dniEntrenador', as: 'entrenador' });

// definiciones de FKs en la tabla de Planes_Usuarios
sequelize.models.Planes.belongsToMany(sequelize.models.Usuarios, { through: sequelize.models.PlanesUsuarios, fields: ['idPlan'] });
sequelize.models.Usuarios.belongsToMany(sequelize.models.Planes, { through: sequelize.models.PlanesUsuarios, fields: ['dniUsuario'] });

// definicion de FKs en la tabla de Videos
sequelize.models.Videos.belongsTo(sequelize.models.Maquinas, { foreignKey: 'idMaquina' });
sequelize.models.Videos.belongsTo(sequelize.models.Ejercicios, { foreignKey: 'idEjercicio' });

// definicion de FKs en la tabla de Ejercicios
sequelize.models.Ejercicios.belongsTo(sequelize.models.Maquinas, { foreignKey: 'idMaquina' });

// definicion de FKs en la tabla de Cuerpo_Areas
sequelize.models.CuerpoAreas.belongsTo(sequelize.models.Ejercicios, { foreignKey: 'idEjercicio' });

// definicion de FKs en la tabla de Pagos
sequelize.models.Pagos.belongsTo(sequelize.models.Usuarios, { foreignKey: 'dniCliente' });

// conexion a la BD
try {
    await sequelize.sync();
} catch (error) {
    console.log("Error en la conexion a la BD:", error.message);
}

// exportando los modelos para usarlos en los servicios
export default sequelize;