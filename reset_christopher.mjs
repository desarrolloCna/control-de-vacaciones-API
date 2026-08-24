import { createClient } from '@libsql/client';
import "dotenv/config";

const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  try {
    const idEmpleado = 79; // Christopher
    const solicitudes = [6, 7];

    console.log("Borrando del historial...");
    await client.execute({
      sql: `DELETE FROM historial_vacaciones WHERE idEmpleado = ? AND idSolicitud IN (6, 7)`,
      args: [idEmpleado]
    });

    console.log("Revirtiendo estado a enviada...");
    await client.execute({
      sql: `UPDATE solicitudes_vacaciones SET estadoSolicitud = 'enviada' WHERE idEmpleado = ? AND idSolicitud IN (6, 7)`,
      args: [idEmpleado]
    });

    console.log("¡Gestiones 6 y 7 revertidas con éxito!");
  } catch(e) {
    console.error(e);
  }
}
run();
