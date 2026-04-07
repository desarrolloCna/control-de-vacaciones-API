import { Connection } from "../connection/conexionsqlite.dao.js";

export const vacacionesReportDao = async (unidad) => {
  try {
    let query;
    let params;

    if (!unidad || unidad === 'Todas') {
      query = `
        SELECT sv.idSolicitud, sv.idEmpleado, sv.correlativo,
        (inf.primerNombre || ' ' || inf.segundoNombre || 
        ' ' || inf.primerApellido || ' ' || inf.segundoApellido) AS Nombre,
        sv.unidadSolicitud, sv.fechaInicioVacaciones, sv.fechaFinVacaciones,
        sv.fechaRetornoLabores, sv.cantidadDiasSolicitados, sv.estadoSolicitud,
        sv.fechaSolicitud, sv.coordinadorResolucion AS coordinadorAprobo,
        sv.fechaResolucion AS fechaAutorizacion, sv.descripcionRechazo, 
        sv.fechaSolicitud,
        emp.puesto, emp.renglon
        FROM solicitudes_vacaciones sv,
        infoPersonalEmpleados inf, empleados emp
        WHERE sv.idEmpleado = emp.idEmpleado
        AND sv.idInfoPersonal = inf.idInfoPersonal
        ORDER BY sv.idSolicitud DESC;
      `;
      params = [];
    } else {
      query = `
        SELECT sv.idSolicitud, sv.idEmpleado, sv.correlativo,
        (inf.primerNombre || ' ' || inf.segundoNombre || 
        ' ' || inf.primerApellido || ' ' || inf.segundoApellido) AS Nombre,
        sv.unidadSolicitud, sv.fechaInicioVacaciones, sv.fechaFinVacaciones,
        sv.fechaRetornoLabores, sv.cantidadDiasSolicitados, sv.estadoSolicitud,
        sv.fechaSolicitud, sv.coordinadorResolucion AS coordinadorAprobo,
        sv.fechaResolucion AS fechaAutorizacion, sv.descripcionRechazo, 
        sv.fechaSolicitud,
        emp.puesto, emp.renglon
        FROM solicitudes_vacaciones sv,
        infoPersonalEmpleados inf, empleados emp
        WHERE sv.idEmpleado = emp.idEmpleado
        AND sv.idInfoPersonal = inf.idInfoPersonal
        AND unidadSolicitud = ?
        ORDER BY sv.idSolicitud DESC;
      `;
      params = [unidad];
    }

    const result = await Connection.execute(query, params);
    
    if (result.rows.length === 0) {
      return [];
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en vacacionesReportDao:", error);
    throw error;
  }
};
