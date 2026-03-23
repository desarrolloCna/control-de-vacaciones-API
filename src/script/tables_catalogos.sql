-- Tabla comunidadesLinguisticas
DROP TABLE IF EXISTS `comunidadesLinguisticas`;
CREATE TABLE `comunidadesLinguisticas` (
  `idComunidadLinguistica` INTEGER PRIMARY KEY AUTOINCREMENT,
  `tipoComunidad` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla departamentos
DROP TABLE IF EXISTS `departamentos`;
CREATE TABLE `departamentos` (
  `IdDepartamento` INTEGER PRIMARY KEY AUTOINCREMENT,
  `departamento` TEXT,
  `create_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla discapacidades
DROP TABLE IF EXISTS `discapacidades`;
CREATE TABLE `discapacidades` (
  `idDiscapacidad` INTEGER PRIMARY KEY AUTOINCREMENT,
  `tipoDiscapacidad` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla estadosCivil
DROP TABLE IF EXISTS `estadosCivil`;
CREATE TABLE `estadosCivil` (
  `idEstadoCivil` INTEGER PRIMARY KEY AUTOINCREMENT,
  `estadoCivil` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla genero
DROP TABLE IF EXISTS `genero`;
CREATE TABLE `genero` (
  `idGenero` INTEGER PRIMARY KEY AUTOINCREMENT,
  `genero` TEXT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla municipios
DROP TABLE IF EXISTS `municipios`;
CREATE TABLE `municipios` (
  `idMunicipio` INTEGER PRIMARY KEY,
  `municipio` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla nivelEducativo
DROP TABLE IF EXISTS `nivelEducativo`;
CREATE TABLE `nivelEducativo` (
  `idNivelEducativo` INTEGER PRIMARY KEY AUTOINCREMENT,
  `nivelEducativo` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla parentescos
DROP TABLE IF EXISTS `parentescos`;
CREATE TABLE `parentescos` (
  `idParentesco` INTEGER PRIMARY KEY AUTOINCREMENT,
  `parentesco` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla puebloPerteneciente
DROP TABLE IF EXISTS `puebloPerteneciente`;
CREATE TABLE `puebloPerteneciente` (
  `idPuebloPerteneciente` INTEGER PRIMARY KEY AUTOINCREMENT,
  `pueblo` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla puestos
DROP TABLE IF EXISTS `puestos`;
CREATE TABLE `puestos` (
  `idPuesto` INTEGER PRIMARY KEY AUTOINCREMENT,
  `puesto` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla religiones
DROP TABLE IF EXISTS `religiones`;
CREATE TABLE `religiones` (
  `idReligion` INTEGER PRIMARY KEY AUTOINCREMENT,
  `religion` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla renglonesPresupuestarios
DROP TABLE IF EXISTS `renglonesPresupuestarios`;
CREATE TABLE `renglonesPresupuestarios` (
  `idRenglonPresupuestario` INTEGER PRIMARY KEY AUTOINCREMENT,
  `renglon` TEXT,
  `descripcion` TEXT,
  `creatAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla rolesUsuarios
DROP TABLE IF EXISTS `rolesUsuarios`;
CREATE TABLE `rolesUsuarios` (
  `idRol` INTEGER PRIMARY KEY AUTOINCREMENT,
  `rol` TEXT,
  `descripcion` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);

-- Tabla unidades
DROP TABLE IF EXISTS `unidades`;
CREATE TABLE `unidades` (
  `idUnidad` INTEGER PRIMARY KEY AUTOINCREMENT,
  `acronimo` TEXT,
  `nombreUnidad` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` TEXT DEFAULT 'A'
);