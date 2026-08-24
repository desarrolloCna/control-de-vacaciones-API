import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  const query = `
    WITH UltimoBalance AS (
      SELECT idEmpleado, periodo, diasDisponiblesTotales,
             ROW_NUMBER() OVER(PARTITION BY idEmpleado, periodo ORDER BY idHistorial DESC) as rn
      FROM HistorialVacaciones
    )
    SELECT em.idEmpleado, 
      (inf.primerNombre || ' ' || inf.primerApellido) AS nombre,
      em.puesto,
      em.unidad,
      em.renglon,
      ub.periodo,
      ub.diasDisponiblesTotales
    FROM empleados em
    JOIN infoPersonalEmpleados inf ON em.idInfoPersonal = inf.idInfoPersonal
    LEFT JOIN UltimoBalance ub ON em.idEmpleado = ub.idEmpleado AND ub.rn = 1
    WHERE em.estado = 'A' AND em.renglon IN ('011', '022')
    LIMIT 10;
  `;
  const result = await client.execute(query);
  console.log(result.rows);
}

run().catch(console.error);
