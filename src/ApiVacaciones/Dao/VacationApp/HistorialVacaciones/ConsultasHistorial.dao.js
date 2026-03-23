import { Connection } from "../../Connection/ConexionSqlite.dao.js";

export const obtenerDatosEmpleadoParaAcumulacionDao = async (idEmpleado) => {
  try {
    const query = `SELECT idEmpleado, idInfoPersonal, fechaIngreso FROM empleados WHERE idEmpleado = ?;`;
    const result = await Connection.execute(query, [idEmpleado]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.log("Error en obtenerDatosEmpleadoParaAcumulacionDao:", error);
    throw error;
  }
};

export const obtenerHistorialPorEmpleadoDao = async (idEmpleado) => {
  try {
    const query = `SELECT idHistorial, idEmpleado, idSolicitudCorrelativo AS Gestion,
                    idEmpleado, periodo, totalDiasAcreditados, diasSolicitados,
                    totalDiasDebitados, diasDisponiblesTotales, fechaAcreditacion, fechaDebito, 
                    tipoRegistro
                    FROM HistorialVacaciones
                    WHERE idEmpleado = ?`;

    const result = await Connection.execute(query, [idEmpleado]);
    
    if (result.rows.length === 0) {
      throw {
        codRes: 409,
        message: "NO EXISTE SOLICITUDES",
      };
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en obtenerHistorialPorEmpleadoDao:", error);
    throw error;
  }
};

export const consultarPeriodosYDiasPorEmpeladoDao = async (idEmpleado, excluirAnioActual = null) => {
  try {
    let query = `SELECT periodo, MIN(diasDisponibles) AS diasDisponibles
                  FROM historial_vacaciones 
                  WHERE idEmpleado = ?`;
    
    const params = [idEmpleado];

    if (excluirAnioActual) {
      query += ` AND CAST(periodo AS INTEGER) < ?`;
      params.push(excluirAnioActual);
    }

    query += ` GROUP BY periodo;`;

    const result = await Connection.execute(query, params);

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows;
  } catch (error) {
    console.log("Error en consultarPeriodosYDiasPorEmpeladoDao:", error);
    throw error;
  }
};

export const consultarDiasDebitadosPorAnioDao = async (idEmpleado, anio) => {
  try {
    const query = `SELECT COALESCE(SUM(diasDebitados), 0) as diasDebitados 
                    FROM historial_vacaciones 
                    WHERE idEmpleado = ?
                    AND strftime('%Y', fechaActualizacion) = ?
                    AND tipoRegistro = 2;`;

    const result = await Connection.execute(query, [idEmpleado, anio]);

    if (result.rows.length === 0) {
      return { diasDisponiblesT: 0 };
    }

    return result.rows[0];
  } catch (error) {
    console.log("Error en consultarDiasDisponiblesDeVacacacionesDao:", error);
    throw error;
  }
};

export const consultarDiasDisponiblesDao = async (idEmpleado, excluirAnioActual = null) => {
  try {
    let query = `SELECT COALESCE(SUM(diasDisponibles), 0) as diasDisponibles 
                    FROM historial_vacaciones 
                    WHERE idEmpleado = ? 
                    AND tipoRegistro = 1`;
                    
    const params = [idEmpleado];

    if (excluirAnioActual) {
      query += ` AND CAST(periodo AS INTEGER) < ?`;
      params.push(excluirAnioActual);
    }

    const result = await Connection.execute(query, params);

    if (result.rows.length === 0) {
      return { diasDisponiblesT: 0 };
    }

    return result.rows[0];
  } catch (error) {
    console.log("Error en consultarDiasDisponiblesDao:", error);
    throw error;
  }
};