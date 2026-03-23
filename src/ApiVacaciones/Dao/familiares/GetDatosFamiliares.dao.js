import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const obtenerFamiliaresDao = async (idEmpleado) => {
  try {
    const query = `SELECT idFamiliar, idInfoPersonal, nombreFamiliar,
                    telefono, parentesco, fechaNacimiento
                    FROM familiaresDeEmpleados
                    WHERE idInfoPersonal = ?;`;

    const result = await Connection.execute(query, [idEmpleado]);
    
    if (result.rows.length === 0) {
      return [];
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en obtenerFamiliaresDao:", error);
    throw error;
  }
};