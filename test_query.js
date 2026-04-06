import { Connection } from "./src/apivacaciones/dao/connection/conexionsqlite.dao.js";

async function run() {
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
      INNER JOIN empleados emp ON sl.idEmpleado = emp.idEmpleado
      WHERE 1=1 AND sl.estadoSolicitud = 'autorizadas'
    `;
    const result = await Connection.execute({ sql: query, args: [] });
    console.log("SUCCESS, rows:", result.rows.length);
  } catch (err) {
    console.error("FAILED:", err);
  }
}
run();
