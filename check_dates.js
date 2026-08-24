import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  const query = `
    SELECT idEmpleado, periodo, tipoRegistro, fechaAcreditacion, fechaDebito 
    FROM HistorialVacaciones 
    WHERE idEmpleado = 19
    LIMIT 5;
  `;
  const result = await client.execute(query);
  console.log(result.rows);
}

run().catch(console.error);
