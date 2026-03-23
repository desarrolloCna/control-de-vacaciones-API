-- Tabla DiasFestivos
DROP TABLE IF EXISTS `DiasFestivos`;
CREATE TABLE `DiasFestivos` (
  `idDiaFestivo` INTEGER PRIMARY KEY AUTOINCREMENT,
  `nombreDia` TEXT NOT NULL,
  `fechaDiaFestivo` TEXT NOT NULL,
  `descripcion` TEXT,
  `medioDia` INTEGER NOT NULL DEFAULT 0,
  `fechaCreacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT NOT NULL DEFAULT 'A'
);

-- Tabla dpiEmpleados
DROP TABLE IF EXISTS `dpiEmpleados`;
CREATE TABLE `dpiEmpleados` (
  `idDpi` INTEGER PRIMARY KEY AUTOINCREMENT,
  `numeroDocumento` TEXT NOT NULL,
  `departamentoExpedicion` TEXT,
  `municipioExpedicion` TEXT,
  `fechaVencimientoDpi` DATE,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A',
  UNIQUE (`numeroDocumento`)
);

-- Tabla infoPersonalEmpleados
DROP TABLE IF EXISTS `infoPersonalEmpleados`;
CREATE TABLE `infoPersonalEmpleados` (
  `idInfoPersonal` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idDpi` INTEGER NOT NULL,
  `primerNombre` TEXT NOT NULL,
  `segundoNombre` TEXT,
  `tercerNombre` TEXT,
  `primerApellido` TEXT,
  `segundoApellido` TEXT,
  `apellidoCasada` TEXT,
  `numeroCelular` TEXT,
  `correoPersonal` TEXT,
  `direccionResidencia` TEXT,
  `estadoCivil` TEXT,
  `Genero` TEXT,
  `departamentoNacimiento` TEXT,
  `municipioNacimiento` TEXT,
  `nit` TEXT,
  `numAfiliacionIgss` TEXT,
  `fechaNacimiento` DATE,
  `numeroLicencia` TEXT,
  `tipoLicencia` TEXT,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT NOT NULL DEFAULT 'A',
  UNIQUE (`idDpi`),
  FOREIGN KEY (`idDpi`) REFERENCES `dpiEmpleados`(`idDpi`) ON DELETE CASCADE
);

-- Tabla empleados
DROP TABLE IF EXISTS `empleados`;
CREATE TABLE `empleados` (
  `idEmpleado` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idInfoPersonal` INTEGER NOT NULL,
  `puesto` TEXT,
  `salario` REAL,
  `fechaIngreso` DATE,
  `correoInstitucional` TEXT,
  `extensionTelefonica` INTEGER,
  `unidad` TEXT,
  `renglon` TEXT,
  `observaciones` TEXT,
  `coordinacion` TEXT,
  `tipoContrato` TEXT,
  `numeroCuentaCHN` TEXT,
  `numeroContrato` TEXT,
  `numeroActa` TEXT,
  `numeroAcuerdo` TEXT,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT '"A"',
  UNIQUE (`idInfoPersonal`),
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE
);

-- Tabla coordinadores
DROP TABLE IF EXISTS `coordinadores`;
CREATE TABLE `coordinadores` (
  `idCoordinador` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idEmpleado` INTEGER NOT NULL,
  `nombreCoordinador` TEXT NOT NULL,
  `coordinadorUnidad` TEXT NOT NULL,
  `correoCoordinador` TEXT NOT NULL,
  `fechaCreacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT NOT NULL DEFAULT 'A',
  FOREIGN KEY (`idEmpleado`) REFERENCES `empleados`(`idEmpleado`) ON DELETE CASCADE
);

-- Tabla datosMedicos
DROP TABLE IF EXISTS `datosMedicos`;
CREATE TABLE `datosMedicos` (
  `idDatoMedico` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idInfoPersonal` INTEGER NOT NULL,
  `discapacidad` TEXT NOT NULL,
  `tipoDiscapacidad` TEXT,
  `tipoSangre` TEXT,
  `condicionMedica` TEXT,
  `tomaMedicina` TEXT NOT NULL,
  `nombreMedicamento` TEXT,
  `sufreAlergia` TEXT,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A',
  UNIQUE (`idInfoPersonal`),
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE
);

-- Tabla familiaresDeEmpleados
DROP TABLE IF EXISTS `familiaresDeEmpleados`;
CREATE TABLE `familiaresDeEmpleados` (
  `idFamiliar` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idInfoPersonal` INTEGER NOT NULL,
  `nombreFamiliar` TEXT NOT NULL,
  `telefono` TEXT,
  `parentesco` TEXT NOT NULL,
  `fechaNacimiento` DATE,
  `fechaCreacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT NOT NULL DEFAULT 'A',
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE
);

-- Tabla nivelEducativo
DROP TABLE IF EXISTS `nivelEducativo`;
CREATE TABLE `nivelEducativo` (
  `idNivelEducativo` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idInfoPersonal` INTEGER NOT NULL,
  `nivelDeEstudios` TEXT NOT NULL,
  `ultimoNivelAlcanzado` TEXT NOT NULL,
  `añoUltimoNivelCursado` DATE NOT NULL,
  `Profesion` TEXT,
  `numeroColegiado` TEXT,
  `fechaColegiacion` DATE,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A',
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE
);

-- Tabla pertenenciaSociolinguistica
DROP TABLE IF EXISTS `pertenenciaSociolinguistica`;
CREATE TABLE `pertenenciaSociolinguistica` (
  `idPertenenciaSoLi` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idInfoPersonal` INTEGER NOT NULL,
  `etnia` TEXT,
  `comunidadLinguistica` TEXT,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A',
  UNIQUE (`idInfoPersonal`),
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE
);

-- Tabla rolesUsuarios
DROP TABLE IF EXISTS `rolesUsuarios`;
CREATE TABLE `rolesUsuarios` (
  `idRol` INTEGER PRIMARY KEY AUTOINCREMENT,
  `rol` TEXT,
  `descripcion` TEXT,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `idUsuario` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idEmpleado` INTEGER NOT NULL,
  `idRol` INTEGER NOT NULL,
  `usuario` TEXT NOT NULL,
  `pass` TEXT NOT NULL,
  `estadoUsuario` TEXT NOT NULL DEFAULT 'A',
  `fechaultimaConexion` DATE,
  `fechaCreacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A',
  UNIQUE (`idEmpleado`),
  UNIQUE (`usuario`),
  FOREIGN KEY (`idEmpleado`) REFERENCES `empleados`(`idEmpleado`) ON DELETE CASCADE,
  FOREIGN KEY (`idRol`) REFERENCES `rolesUsuarios`(`idRol`)
);

-- Tabla solicitudes_vacaciones
DROP TABLE IF EXISTS `solicitudes_vacaciones`;
CREATE TABLE `solicitudes_vacaciones` (
  `idSolicitud` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idEmpleado` INTEGER NOT NULL,
  `idInfoPersonal` INTEGER NOT NULL,
  `idCoordinador` INTEGER NOT NULL,
  `unidadSolicitud` TEXT NOT NULL,
  `fechaInicioVacaciones` DATE NOT NULL,
  `fechaFinVacaciones` DATE NOT NULL,
  `fechaRetornoLabores` DATE NOT NULL,
  `cantidadDiasSolicitados` INTEGER NOT NULL,
  `estadoSolicitud` TEXT NOT NULL DEFAULT 'enviada',
  `fechaSolicitud` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `coordinadorResolucion` TEXT,
  `fechaResolucion` DATETIME,
  `descripcionRechazo` TEXT,
  `fechaCreacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT NOT NULL DEFAULT 'A',
  FOREIGN KEY (`idEmpleado`) REFERENCES `empleados`(`idEmpleado`) ON DELETE CASCADE,
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE
);

-- Tabla historial_vacaciones
DROP TABLE IF EXISTS `historial_vacaciones`;
CREATE TABLE `historial_vacaciones` (
  `idHistorial` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idEmpleado` INTEGER NOT NULL,
  `idInfoPersonal` INTEGER NOT NULL,
  `idSolicitud` INTEGER,
  `periodo` INTEGER NOT NULL,
  `diasAcreditados` INTEGER,
  `diasSolicitados` INTEGER,
  `diasDebitados` INTEGER,
  `diasDisponibles` INTEGER,
  `sumatoriaDias` REAL,
  `fechaActualizacion` DATE,
  `fechaAcreditacion` DATE,
  `tipoRegistro` INTEGER DEFAULT 1,
  `estado` TEXT DEFAULT 'A',
  FOREIGN KEY (`idEmpleado`) REFERENCES `empleados`(`idEmpleado`) ON DELETE CASCADE,
  FOREIGN KEY (`idInfoPersonal`) REFERENCES `infoPersonalEmpleados`(`idInfoPersonal`) ON DELETE CASCADE,
  FOREIGN KEY (`idSolicitud`) REFERENCES `solicitudes_vacaciones`(`idSolicitud`) ON DELETE CASCADE
);

-- Tabla suspensiones
DROP TABLE IF EXISTS `suspensiones`;
CREATE TABLE `suspensiones` (
  `idSuspension` INTEGER PRIMARY KEY AUTOINCREMENT,
  `idEmpleado` INTEGER,
  `CUI` TEXT,
  `nombreEmpleado` TEXT,
  `fechaInicioSuspension` DATE,
  `fechaFinSuspension` DATE,
  `descripcionSuspension` TEXT,
  `fechaIngresoGestion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A',
  FOREIGN KEY (`idEmpleado`) REFERENCES `empleados`(`idEmpleado`) ON DELETE CASCADE
);

-- Tabla principal de parámetros
DROP TABLE IF EXISTS `config_params`;
CREATE TABLE IF NOT EXISTS config_params (
    idParam INTEGER PRIMARY KEY AUTOINCREMENT,
    servicio TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    valor TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'A',
);

DROP TABLE IF EXISTS vacaciones_especiales;
CREATE TABLE IF NOT EXISTS vacaciones_especiales (
    idVacacionesEspeciales INTEGER PRIMARY KEY AUTOINCREMENT,
    idEmpleado INTEGER,
    idInfoPersonal INTEGER,
    idUsuario INTEGER,
    flagAutorizacion INTEGER DEFAULT 1,
    descripcion TEXT,
    fechaInicioValidez DATE,
    fechaFinValidez DATE,
    idSolicitud INTEGER,
    fechaIngresoGestion DATETIME,
    estado TEXT NOT NULL DEFAULT 'A',
    FOREIGN KEY (idEmpleado) REFERENCES empleados(idEmpleado) ON DELETE CASCADE,
    FOREIGN KEY (idInfoPersonal) REFERENCES infoPersonalEmpleados(idInfoPersonal) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
);
