import { Connection } from "../connection/conexionsqlite.dao.js";

export const IngresarInfoPersonalDao = async (data) => {
    console.log(data)
    try {
        // Verificar si el idDpi ya existe
        const existResult = await Connection.execute(
            "SELECT idDpi FROM infoPersonalEmpleados WHERE idDpi = ? AND estado = 'A'", 
            [data.idDpi]
        );
        
        if (existResult.rows.length === 1) {
            throw {
                codRes: 409,
                message: "idDpi asociado a otro registro" 
            };
        }

        // Insertar nueva información personal
        const result = await Connection.execute(
            "INSERT INTO infoPersonalEmpleados (primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, apellidoCasada, numeroCelular, correoPersonal, direccionResidencia, idDpi, estadoCivil, Genero, departamentoNacimiento, municipioNacimiento, nit, numAfiliacionIgss, fechaNacimiento, numeroLicencia, tipoLicencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
            [
                data.primerNombre,
                data.segundoNombre,
                data.tercerNombre,
                data.primerApellido,
                data.segundoApellido,
                data.apellidoCasada,
                data.numeroCelular,
                data.correoPersonal,
                data.direccionResidencia,
                data.idDpi,
                data.estadoCivil,
                data.genero,
                data.departamentoNacimiento,
                data.municipioNacimiento,
                data.nit,
                data.numAfiliacionIgss,
                data.fechaNacimiento,
                data.numeroLicencia,
                data.tipoLicencia
            ]
        );

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarInfoPersonalDao:", error);
        throw error;
    }
};

export const ObtenerNombresDao = async (idEmpleado) => {
    try {
        const sql = 'SELECT ip.primerNombre, ip.segundoNombre, ip.primerApellido, ip.segundoApellido FROM infoPersonalEmpleados ip, empleados e WHERE ip.idInfoPersonal = e.idInfoPersonal AND e.idEmpleado = ?;';

        const result = await Connection.execute(sql, [idEmpleado]);
        
        if (result.rows.length === 0) {
            throw {
                codRes: 404,
                message: "No se encontraron datos para el empleado"
            };
        }
        
        return result.rows[0]; 
    } catch (error) {
        console.log("Error en ObtenerNombresDao:", error);
        throw error;
    }
};
