import {Connection} from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';
async function test() {
    try {
        const query = `
      SELECT 
          em.idEmpleado, 
          inf.idInfoPersonal,
          dp.numeroDocumento
      FROM 
          dpiEmpleados dp
      INNER JOIN 
          infoPersonalEmpleados inf ON dp.idDpi = inf.idDpi
      INNER JOIN 
          empleados em ON inf.idInfoPersonal = em.idInfoPersonal
      WHERE em.estado = 'A' 
      AND inf.primerNombre NOT LIKE '%ADMINISTRADOR%'
      AND em.idEmpleado NOT IN (
          SELECT idEmpleado FROM suspensiones WHERE tipoSuspension = 'baja' AND estado = 'A'
      );
    `;
        const res = await Connection.execute(query);
        console.log('Employees with DPI:', res.rows.length);
    } catch(e) {
        console.error("Error executing query:", e);
    }
}
test();
