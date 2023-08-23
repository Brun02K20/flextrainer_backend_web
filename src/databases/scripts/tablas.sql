CREATE TABLE IF NOT EXISTS Usuarios(
    'dni' INTEGER PRIMARY KEY AUTOINCREMENT,
    'nombre' TEXT NOT NULL,
    'apellido' TEXT NOT NULL,
    'correoElectronico' TEXT NOT NULL UNIQUE,
    'fechaDeNacimiento' DATE NOT NULL,
    'numeroTelefono' TEXT NOT NULL UNIQUE,
    'password' TEXT NOT NULL,
    'idRol' INTEGER NOT NULL,
    'dniCliente' INTEGER,
    'dniEntrenador' INTEGER,
    CONSTRAINT idRol_FK FOREIGN KEY ('idRol') REFERENCES Roles('id'),
    CONSTRAINT dniCliente_FK FOREIGN KEY ('dniCliente') REFERENCES Usuarios('dni'),
    CONSTRAINT dniEntrenador_FK FOREIGN KEY ('dniEntrenador') REFERENCES Usuarios('dni')
);

CREATE TABLE IF NOT EXISTS Roles(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'nombre' TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Planes_Usuarios(
    'dniUsuario' INTEGER NOT NULL,
    'idPlan' INTEGER NOT NULL,
    CONSTRAINT pk_PU PRIMARY KEY ('dniUsuario', 'idPlan'),
    CONSTRAINT dniUser_FK FOREIGN KEY ('dniUsuario') REFERENCES Usuarios('dni'),
    CONSTRAINT idPlan_FK FOREIGN KEY ('idPlan') REFERENCES Planes('id')
);

CREATE TABLE IF NOT EXISTS Videos(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'nombre' TEXT NOT NULL,
    'url' TEXT NOT NULL,
    'idMaquina' INTEGER NOT NULL,
    'idEjercicio' INTEGER NOT NULL,
    CONSTRAINT idMaq_FK FOREIGN KEY ('idMaquina') REFERENCES Maquinas('id'),
    CONSTRAINT idEj_FK FOREIGN KEY ('idEjercicio') REFERENCES Ejercicios('id')
);

CREATE TABLE IF NOT EXISTS Ejercicios(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'nombre' TEXT NOT NULL,
    'idMaquina' INTEGER NOT NULL,
    CONSTRAINT idMaq_FK FOREIGN KEY ('idMaquina') REFERENCES Maquinas('id')
);

CREATE TABLE IF NOT EXISTS Cuerpo_Areas(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'nombre' TEXT NOT NULL,
    'idEjercicio' INTEGER NOT NULL,
    CONSTRAINT idEj_FK FOREIGN KEY ('idEjercicio') REFERENCES Ejercicios('id')
);

CREATE TABLE IF NOT EXISTS Maquinas(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'nombre' TEXT NOT NULL,
    'pesoLimite' INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS Planes(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'fechaInicio' DATE NOT NULL,
    'fechaFin' DATE NOT NULL
-- aca faltan los atributos que vinculen el plan con el tema de las maquinas, los ejercicios, y todo eso
);


-- Esta tabla es por el momento provisional, aun no se bien que otros atributos podrian ir aca, 
-- considerando que vamos a usar la API de MP (que aun no tengo idea de como se usa)
CREATE TABLE IF NOT EXISTS Pagos(
    'fechaPago' DATE NOT NULL,
    'horaPago' TIME NOT NULL,
    'dniCliente' INTEGER NOT NULL,
    'monto' DECIMAL(10, 2) NOT NULL,
    CONSTRAINT pk_Pagos PRIMARY KEY ('fechaPago', 'horaPago', 'dniCliente'),
    CONSTRAINT dniCliente_FK FOREIGN KEY ('dniCliente') REFERENCES Usuarios('dni')
);