import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const getVacacionesAutorizadasGlobalDao = async (unidad = null, idRol = null, puestoUsuario = null) => {
  try {
    let query = `
      SELECT 
        sl.idSolicitud, 
        sl.unidadSolicitud,
        sl.fechaInicioVacaciones, 
        sl.fechaFinVacaciones,
        sl.fechaRetornoLabores,
        sl.estadoSolicitud,
        emp.puesto,
        emp.renglon,
        (inf.primerNombre || ' ' || COALESCE(inf.segundoNombre, '') || ' ' || inf.primerApellido || ' ' || COALESCE(inf.segundoApellido, '')) AS nombreCompleto
      FROM solicitudes_vacaciones sl
      INNER JOIN infoPersonalEmpleados inf ON sl.idInfoPersonal = inf.idInfoPersonal
      INNER JOIN empleados emp ON inf.idInfoPersonal = emp.idInfoPersonal
      WHERE 1=1
    `;
    
    let args = [];
    const rol = parseInt(idRol);

    // Condicion combinada: Es director si es Rol 1/2 o si es Rol 5 con Puesto Gerencial.
    const isDirectorOrAdmin = 
      rol === 1 || 
      rol === 2 || 
      (rol === 5 && puestoUsuario && (puestoUsuario.includes('Director General') || puestoUsuario.includes('Subdirector General')));

    if (isDirectorOrAdmin) {
      // Alta Gerencia / RRHH: Ven TODAS las autorizadas, opcionalmente filtradas
      query += ` AND sl.estadoSolicitud = 'autorizadas'`;
      if (unidad && unidad !== 'Todas') {
        query += ` AND sl.unidadSolicitud = ?`;
        args.push(unidad);
      }
    } else if (rol === 5) {
      // Coordinador (Rol 5): Ve autorizadas y pendientes de su unidad, OMITIENDO Director y Subdirector
      query += ` AND sl.estadoSolicitud IN ('autorizadas', 'enviada')`;
      query += ` AND emp.puesto NOT LIKE '%Director General%' AND emp.puesto NOT LIKE '%Subdirector General%'`;
      if (unidad && unidad !== 'Todas') {
        query += ` AND sl.unidadSolicitud = ?`;
        args.push(unidad);
      }
    } else {
      // Bloque general (Jefes 3 / Empleados 4 no deberían acceder según menú, pero por seguridad restringimos código)
      query += ` AND sl.estadoSolicitud = 'autorizadas'`;
      if (unidad && unidad !== 'Todas') {
        query += ` AND sl.unidadSolicitud = ?`;
        args.push(unidad);
      }
    }
    
    query += ` ORDER BY sl.fechaInicioVacaciones DESC;`;

    const result = await Connection.execute({ sql: query, args: args });
    return result.rows || [];
  } catch (error) {
    console.log("Error en getVacacionesAutorizadasGlobalDao:", error);
    throw error;
  }
};
