import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerDatosMedicoDao = async (idInfoPersonal) => {
  try {
    const query = `SELECT idDatoMedico, discapacidad, tipoDiscapacidad, tipoSangre,
                    condicionMedica, tomaMedicina, nombreMedicamento, 
                    sufreAlergia
                    FROM datosMedicos
                    WHERE idInfoPersonal = ?;`;

    const result = await Connection.execute(query, [idInfoPersonal]);
    
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en obtenerDatosMedicoDao:", error);
    throw error;
  }
};
