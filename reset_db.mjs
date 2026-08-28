import { createClient } from '@libsql/client';
import "dotenv/config";

const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  try {
    console.log("1. Eliminando todas las solicitudes de vacaciones...");
    await client.execute(`DELETE FROM solicitudes_vacaciones;`);

    console.log("2. Reiniciando el contador de IDs (AUTOINCREMENT) de solicitudes_vacaciones...");
    // En SQLite, la tabla sqlite_sequence guarda los contadores de AUTOINCREMENT
    await client.execute(`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'solicitudes_vacaciones';`);

    console.log("3. Eliminando todos los débitos del historial de vacaciones (tipoRegistro = 2)...");
    await client.execute(`DELETE FROM historial_vacaciones WHERE tipoRegistro = 2;`);

    console.log("¡Todo listo! La base de datos está limpia de solicitudes de vacaciones.");
  } catch(e) {
    console.error(e);
  }
}
run();
