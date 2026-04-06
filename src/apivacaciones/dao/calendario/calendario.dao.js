import { Connection } from "../connection/conexionsqlite.dao.js";

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
        (COALESCE(inf.primerNombre, '') || ' ' || COALESCE(inf.segundoNombre, '') || ' ' || COALESCE(inf.primerApellido, '') || ' ' || COALESCE(inf.segundoApellido, '')) AS nombreCompleto
      FROM solicitudes_vacaciones sl
      INNER JOIN infoPersonalEmpleados inf ON sl.idInfoPersonal = inf.idInfoPersonal
      INNER JOIN empleados emp ON sl.idEmpleado = emp.idEmpleado
      WHERE sl.fechaFinVacaciones >= date('now', '-3 months')
    `;
    
    let args = [];

    // Solo Director General y Subdirector General tienen acceso completo
    const isDirectorGeneral = 
      puestoUsuario && (puestoUsuario.toUpperCase().includes('DIRECTOR GENERAL') || puestoUsuario.toUpperCase().includes('SUBDIRECTOR GENERAL'));

    if (isDirectorGeneral) {
      // Director/Subdirector: Ven TODAS las solicitudes autorizadas de todos los empleados
      query += ` AND sl.estadoSolicitud = 'autorizadas'`;
      if (unidad && unidad !== 'Todas') {
        query += ` AND sl.unidadSolicitud = ?`;
        args.push(unidad);
      }
    } else {
      // Cualquier otro usuario que logre acceder: solo ve autorizadas de su unidad
      query += ` AND sl.estadoSolicitud = 'autorizadas'`;
      if (unidad && unidad !== 'Todas') {
        query += ` AND sl.unidadSolicitud = ?`;
        args.push(unidad);
      }
    }
    
    query += ` ORDER BY sl.fechaInicioVacaciones DESC;`;

    const result = await Connection.execute(query, args);
    return result.rows || [];
  } catch (error) {
    console.log("Error en getVacacionesAutorizadasGlobalDao:", error);
    throw error;
  }
};
