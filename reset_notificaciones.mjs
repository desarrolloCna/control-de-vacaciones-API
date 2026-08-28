import { createClient } from '@libsql/client';
import "dotenv/config";

const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  try {
    console.log("1. Eliminando todas las notificaciones...");
    await client.execute(`DELETE FROM notificaciones;`);

    console.log("2. Reiniciando el contador de IDs (AUTOINCREMENT) de notificaciones...");
    // En SQLite, la tabla sqlite_sequence guarda los contadores de AUTOINCREMENT
    await client.execute(`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'notificaciones';`);

    console.log("¡Todo listo! La tabla de notificaciones está limpia.");
  } catch(e) {
    console.error(e);
  }
}
run();
