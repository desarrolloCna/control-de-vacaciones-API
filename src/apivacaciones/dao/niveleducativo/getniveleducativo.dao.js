import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerNivelEducativoInfoDao = async (idInfoPersonal) => {
  try {
    const query = `SELECT idNivelEducativo, idInfoPersonal, nivelDeEstudios,
                   ultimoNivelAlcanzado, añoUltimoNivelCursado, Profesion, 
                   numeroColegiado, fechaColegiacion FROM nivelEducativo
                   WHERE idInfoPersonal = ?;`;

    const result = await Connection.execute(query, [idInfoPersonal]);
    
    if (result.rows.length === 0) {
      return null; // No hay registro de nivel educativo, pero no es un error
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en obtenerNivelEducativoInfoDao:", error);
    throw error;
  }
};
