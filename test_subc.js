import dotenv from 'dotenv';
dotenv.config();

import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function run() {
  const query = `
    SELECT e.idEmpleado, e.puesto, e.unidad, i.primerNombre, i.primerApellido 
    FROM empleados e 
    JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal 
    WHERE e.puesto LIKE '%Subcoordinador%'`;
  const result = await Connection.execute(query);
  console.log(result.rows);
  
  const query2 = `
    SELECT e.idEmpleado, COUNT(eu.idEmpleado) as count 
    FROM empleados e 
    LEFT JOIN empleadosUltimoAnio eu ON e.idEmpleado = eu.idEmpleado
    WHERE e.puesto LIKE '%Subcoordinador%'
    GROUP BY e.idEmpleado`;
  const result2 = await Connection.execute(query2);
  console.log("Count in empleadosUltimoAnio:");
  console.log(result2.rows);
}
run();
