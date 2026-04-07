import { Connection } from "../connection/conexionsqlite.dao.js";

export const getSolicitudesByIdDao = async (idEmpleado, idInfoPersonal) => {
  try {
    const query = `SELECT idSolicitud, idEmpleado, idInfoPersonal, unidadSolicitud,
                    fechaInicioVacaciones, fechaFinVacaciones, fechaRetornoLabores, 
                    cantidadDiasSolicitados, estadoSolicitud, fechaSolicitud,
                    coordinadorResolucion, fechaResolucion, descripcionRechazo, correlativo 
                    FROM solicitudes_vacaciones
                    WHERE idEmpleado = ?
                    and idInfoPersonal = ?  
                    ORDER BY idSolicitud desc
                    LIMIT 1;`;

    const result = await Connection.execute(query, [idEmpleado, idInfoPersonal]);
    
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en getSolicitudesByIdDao:", error);
    throw error;
  }
};

export const getSolicitudesByIdSolcitudDao = async (idSolicitud, idEmpleado) => {
  try {
    const query = `SELECT sl.idSolicitud, (inf.primerNombre || ' ' || inf.segundoNombre || 
                  ' ' || inf.primerApellido || ' ' || inf.segundoApellido) AS nombreCompleto, emp.correoInstitucional,
                  emp.puesto, emp.fechaIngreso, emp.renglon, sl.unidadSolicitud, sl.cantidadDiasSolicitados, sl.fechaInicioVacaciones, 
                  sl.fechaFinVacaciones, sl.fechaRetornoLabores, sl.idCoordinador, sl.correlativo, sl.fechaSolicitud, sl.estadoSolicitud
                  FROM solicitudes_vacaciones sl, infoPersonalEmpleados inf, empleados emp
                  WHERE sl.idInfoPersonal = inf.idInfoPersonal
                  AND sl.idEmpleado = emp.idEmpleado
                  AND idSolicitud = ?
                  AND sl.idEmpleado = ?;`;

    const result = await Connection.execute(query, [idSolicitud, idEmpleado]);
    
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en getSolicitudesByIdSolcitudDao:", error);
    throw error;
  }
};

export const consultarSolicitudesPorEmpleadoDao = async (idEmpleado) => {
  try {
    const query = `SELECT idSolicitud, idEmpleado, idInfoPersonal, unidadSolicitud,
                    fechaInicioVacaciones, fechaFinVacaciones, fechaRetornoLabores, 
                    cantidadDiasSolicitados, estadoSolicitud, fechaSolicitud,
                    coordinadorResolucion, fechaResolucion, descripcionRechazo, 
  					        estado, correlativo
                    FROM solicitudes_vacaciones
                    WHERE idEmpleado = ?
                    ORDER BY idSolicitud DESC;`;

    const result = await Connection.execute(query, [idEmpleado]);
    
    if (result.rows.length === 0) {
      throw {
        codRes: 204,
        message: "NO EXISTE SOLICITUDES",
      };
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en consultarSolicitudesPorEmpleadoDao:", error);
    throw error;  
  }
};
