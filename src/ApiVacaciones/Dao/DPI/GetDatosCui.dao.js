import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerInfoDPIDao = async (idDpi) => {
  try {
    const query = `SELECT dp.idDpi, dp.numeroDocumento, dp.departamentoExpedicion,
                    dp.municipioExpedicion, dp.fechaVencimientoDpi
                    FROM dpiEmpleados dp
                    INNER JOIN infoPersonalEmpleados ip ON dp.idDpi = ip.idDpi
                    WHERE ip.idInfoPersonal = ?;`;

    const result = await Connection.execute(query, [idDpi]);
    
    if (result.rows.length === 0) {
      throw {
        codRes: 409,
        message: "NO EXISTE EMPLEADO CON EL ID INGRESADO",
      };
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en obtenerInfoDPIDao:", error);
    throw error;
  }
};
