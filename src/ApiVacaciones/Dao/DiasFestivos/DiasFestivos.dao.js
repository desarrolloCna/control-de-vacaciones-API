import { Connection } from "../connection/conexionsqlite.dao.js";

export const getDiasFestivosDao = async () => {
  try {
    const query = `SELECT idDiasFestivos, fechaDiaFestivo, nombreDiaFestivo,
                   medioDia, estado FROM dias_festivos WHERE estado = 'A';`;

    const result = await Connection.execute(query);
    
    if (result.rows.length === 0) {
      throw {
        codRes: 409,
        message: "NO HAY DIAS FESTIVOS PROGRAMADOS",
      };
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en getDiasFestivosDao:", error);
    throw error;
  }
};

export const createDiaFestivoDao = async (data) => {
  try {
    const query = `INSERT INTO dias_festivos (nombreDiaFestivo, fechaDiaFestivo, medioDia, estado) VALUES (?, ?, ?, ?)`;
    const params = [data.nombreDiaFestivo, data.fechaDiaFestivo, data.medioDia ? 1 : 0, data.estado || 'A'];
    const result = await Connection.execute(query, params);
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateDiaFestivoDao = async (id, data) => {
  try {
    const query = `UPDATE dias_festivos SET nombreDiaFestivo = ?, fechaDiaFestivo = ?, medioDia = ?, estado = ? WHERE idDiasFestivos = ?`;
    const params = [data.nombreDiaFestivo, data.fechaDiaFestivo, data.medioDia ? 1 : 0, data.estado || 'A', id];
    const result = await Connection.execute(query, params);
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteDiaFestivoDao = async (id) => {
  try {
    const query = `DELETE FROM dias_festivos WHERE idDiasFestivos = ?`;
    const result = await Connection.execute(query, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};
