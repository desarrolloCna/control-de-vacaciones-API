import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const obtenerInfoPersonalDao = async (idInfoPersonal) => {
  try {
    const query = `SELECT idInfoPersonal, primerNombre, segundoNombre, tercerNombre,  
                    primerApellido, segundoApellido, apellidoCasada,
                    numeroCelular, correoPersonal, direccionResidencia, estadoCivil, Genero,
                    departamentoNacimiento, municipioNacimiento,
                    nit, numAfiliacionIgss, fechaNacimiento,
                    numeroLicencia, tipoLicencia
                    FROM infoPersonalEmpleados
                    WHERE idInfoPersonal = ?;`;

    const result = await Connection.execute(query, [idInfoPersonal]);
    
    if (result.rows.length === 0) {
      throw {
        codRes: 409,
        message: "NO EXISTE EMPLEADO CON EL ID INGRESADO",
      };
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en obtenerInfoPersonalDao:", error);
    throw error;
  }
};