import { CloseConection, OpenConection } from "../Connection/ConexionV.dao.js";

let dbConnection;

export const getSolicitudesByIdDao = async (idEmpleado, idInfoPersonal) => {
  try {
    dbConnection = await OpenConection();
    await dbConnection.beginTransaction();

    const query = `select idSolicitud, idEmpleado, idInfoPersonal, unidadSolicitud,
                    fechaInicioVacaciones, fechaFinVacaciones, fechaRetornoLabores, 
                    cantidadDiasSolicitados, estadoSolicitud, fechaSolicitud,
                    coordinadorResolucion, fechaResolucion, descripcionRechazo 
                    from solicitudes_vacaciones
                    where idEmpleado = ?
                    and idInfoPersonal = ?
                    and estado = 'A' 
                    order by idSolicitud desc
                    limit 1;
                    `;

    const [solicitud] = await dbConnection.query(query, [idEmpleado, idInfoPersonal]);
    if (solicitud.length === 0) {
      throw {
        codRes: 409,
        message: "NO EXISTE SOLICITUDES",
      };
    } else {
      return solicitud[0];
    }
  } catch (error) {
    throw error;
  } finally {
    if (dbConnection) {
      await CloseConection(dbConnection);
    }
  }
};



export const getSolicitudesByIdSolcitudDao = async (idSolicitud, idEmpleado) => {
  try {
    dbConnection = await OpenConection();
    await dbConnection.beginTransaction();

    const query = `select sl.idSolicitud, CONCAT(inf.primerNombre, ' ', inf.segundoNombre, 
                  ' ', inf.primerApellido, ' ', inf.segundoApellido) AS nombreCompleto, inf.correoPersonal,
                  emp.puesto, sl.unidadSolicitud, sl.cantidadDiasSolicitados, sl.fechaInicioVacaciones, 
                  sl.fechaFinVacaciones, sl.fechaRetornoLabores
                  from solicitudes_vacaciones sl, infoPersonalEmpleados inf, empleados emp
                  where sl.idInfoPersonal = inf.idInfoPersonal
                  and sl.idEmpleado = emp.idEmpleado
                  and idSolicitud = ?
                  and sl.idEmpleado = ?;
                    `;

    const [solicitud] = await dbConnection.query(query, [idSolicitud, idEmpleado]);
    if (solicitud.length === 0) {
      throw {
        codRes: 409,
        message: "NO EXISTE SOLICITUD",
      };
    } else {
      return solicitud[0];
    }
  } catch (error) {
    throw error;
  } finally {
    if (dbConnection) {
      await CloseConection(dbConnection);
    }
  }
};
