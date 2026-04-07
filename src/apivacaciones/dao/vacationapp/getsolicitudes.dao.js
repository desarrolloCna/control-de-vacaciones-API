import { Connection } from "../connection/conexionsqlite.dao.js";

export const getSolicitudesDao = async (idCoordinador) => {
  try {
    const query = `SELECT 
                        sl.idSolicitud, sl.idEmpleado,  sl.idInfoPersonal, 
                        (inf.primerNombre || ' ' || inf.segundoNombre || ' ' || inf.primerApellido || ' ' || inf.segundoApellido) AS nombreCompleto, 
                        sl.unidadSolicitud, sl.fechaInicioVacaciones, sl.fechaFinVacaciones, sl.fechaRetornoLabores, sl.cantidadDiasSolicitados, 
                        sl.estadoSolicitud, sl.fechaSolicitud, sl.descripcionRechazo
                    FROM 
                        solicitudes_vacaciones sl
                    JOIN 
                        infoPersonalEmpleados inf ON sl.idInfoPersonal = inf.idInfoPersonal
                    WHERE 
                        idCoordinador = ?;
                    `;

    const result = await Connection.execute(query, [idCoordinador]);
    
    if (result.rows.length === 0) {
      return [];
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en getSolicitudesDao:", error);
    throw error;
  }
};

export const consultarDiasSolicitadosPorAnioDao = async (idEmpleado, anio) => {
  try {
    const query = `SELECT idEmpleado, diasSolicitados FROM historial_vacaciones 
                    WHERE tipoRegistro = 2
                    AND idEmpleado = ?
                    AND strftime('%Y', fechaActualizacion) = ?;`;

    const result = await Connection.execute(query, [idEmpleado, anio]);

    if (result.rows.length === 0) {
      return {
        idEmpleado: idEmpleado,
        diasSolicitados: 0
      };
    }

    return result.rows;
  } catch (error) {
    console.log("Error en consultarDiasSolicitadosPorAnioDao:", error);
    throw error;
  }
};
