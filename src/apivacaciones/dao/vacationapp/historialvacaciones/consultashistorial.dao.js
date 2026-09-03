import { Connection } from "../../connection/conexionsqlite.dao.js";

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
    const query = `SELECT hv.idHistorial, hv.idEmpleado, hv.idSolicitudCorrelativo AS Gestion,
                    hv.idSolicitudOriginal, hv.idSolicitudCorrelativo, hv.idEmpleado, hv.periodo, hv.totalDiasAcreditados, hv.diasAcreditados, hv.diasSolicitados,
                    hv.totalDiasDebitados, hv.diasDisponiblesTotales, hv.fechaAcreditacion, hv.fechaDebito, 
                    hv.tipoRegistro, t.diasDebitados
                    FROM HistorialVacaciones hv
                    JOIN historial_vacaciones t ON hv.idHistorial = t.idHistorial
                    WHERE hv.idEmpleado = ?`;

    const result = await Connection.execute(query, [idEmpleado]);
    
    if (result.rows.length === 0) {
      return [];
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
    // diasDebitadosPeriodo: débitos brutos del año menos devoluciones por cancelación del mismo año.
    // Se usa MAX(0,...) para evitar que las devoluciones produzcan un valor negativo
    // (ej: si la solicitud se debitó en periodo 2025 pero el crédito de cancelación quedó en 2026).
    let queryPeriodo = `SELECT MAX(0,
                          COALESCE(SUM(diasDebitados), 0) - 
                          COALESCE(SUM(CASE WHEN tipoRegistro = 1 AND idSolicitud IS NOT NULL THEN diasAcreditados ELSE 0 END), 0)
                        ) as diasDebitadosPeriodo 
                  FROM historial_vacaciones 
                  WHERE idEmpleado = ? AND estado = 'A' AND CAST(periodo AS INTEGER) = ?;`;
                    
    let queryGlobal = `SELECT MAX(0,
                          COALESCE(SUM(diasDebitados), 0) - 
                          COALESCE(SUM(CASE WHEN tipoRegistro = 1 AND idSolicitud IS NOT NULL THEN diasAcreditados ELSE 0 END), 0)
                        ) as diasDebitadosTotales 
                  FROM historial_vacaciones 
                  WHERE idEmpleado = ? AND estado = 'A';`;

    const resultPeriodo = await Connection.execute(queryPeriodo, [idEmpleado, anio]);
    const resultGlobal = await Connection.execute(queryGlobal, [idEmpleado]);

    const diasDebitadosPeriodo = resultPeriodo.rows.length > 0 ? resultPeriodo.rows[0].diasDebitadosPeriodo : 0;
    const diasDebitadosTotales = resultGlobal.rows.length > 0 ? resultGlobal.rows[0].diasDebitadosTotales : 0;

    return { 
      diasDebitadosPeriodo: diasDebitadosPeriodo,
      diasDebitadosTotales: diasDebitadosTotales
    };
  } catch (error) {
    console.log("Error en consultarDiasDisponiblesDeVacacacionesDao:", error);
    throw error;
  }
};


export const consultarDiasDisponiblesDao = async (idEmpleado, excluirAnioActual = null) => {
  try {
    let query = `SELECT 
                    COALESCE(
                        SUM(CASE WHEN tipoRegistro = 1 AND idSolicitud IS NULL THEN diasAcreditados ELSE 0 END), 
                        0
                    ) as diasDisponibles
                    FROM historial_vacaciones 
                    WHERE idEmpleado = ? AND estado = 'A'`;
                    
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

export const consultarDiasDisponiblesPorPeriodoDao = async (idEmpleado, anio) => {
  try {
    let query = `SELECT 
                    COALESCE(
                        SUM(CASE WHEN tipoRegistro = 1 AND idSolicitud IS NULL THEN diasAcreditados ELSE 0 END), 
                        0
                    ) as diasDisponiblesPeriodo
                    FROM historial_vacaciones 
                    WHERE idEmpleado = ? AND estado = 'A' AND CAST(periodo AS INTEGER) = ?`;
                    
    const result = await Connection.execute(query, [idEmpleado, anio]);

    if (result.rows.length === 0) {
      return { diasDisponiblesPeriodo: 0 };
    }

    return result.rows[0];
  } catch (error) {
    console.log("Error en consultarDiasDisponiblesPorPeriodoDao:", error);
    throw error;
  }
};

export const consultarDebitosPorSolicitudDao = async (idSolicitud) => {
  try {
    const query = `SELECT periodo, diasDebitados AS diasTomados, diasDisponibles 
                   FROM historial_vacaciones 
                   WHERE idSolicitud = ? AND tipoRegistro = 2
                   ORDER BY idHistorial ASC;`;
    const result = await Connection.execute(query, [idSolicitud]);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.log("Error en consultarDebitosPorSolicitudDao:", error);
    throw error;
  }
};
