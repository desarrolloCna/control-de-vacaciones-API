import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const obtenerPertenenciaSoliDao = async (idInfoPersonal) => {
  try {
    const query = `SELECT idPertenenciaSoLi, etnia, 
                    comunidadLinguistica
                    FROM pertenenciaSociolinguistica
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
    console.log("Error en obtenerPertenenciaSoliDao:", error);
    throw error;
  }
};