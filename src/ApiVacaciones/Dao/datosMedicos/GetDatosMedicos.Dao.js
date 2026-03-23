import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const obtenerDatosMedicoDao = async (idInfoPersonal) => {
  try {
    const query = `SELECT idDatoMedico, discapacidad, tipoDiscapacidad, tipoSangre,
                    condicionMedica, tomaMedicina, nombreMedicamento, 
                    sufreAlergia
                    FROM datosMedicos
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
    console.log("Error en obtenerDatosMedicoDao:", error);
    throw error;
  }
};