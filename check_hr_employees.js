import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  const query = `
    SELECT e.idEmpleado, e.Nombres, e.Apellidos, e.idUnidad, u.nombreUnidad, e.estado
    FROM empleados e
    LEFT JOIN unidades u ON e.idUnidad = u.idUnidad
    WHERE u.nombreUnidad LIKE '%Recursos Humanos%' OR e.idUnidad = 3;
  `;
  const result = await client.execute(query);
  console.log(result.rows);
}

run().catch(console.error);
