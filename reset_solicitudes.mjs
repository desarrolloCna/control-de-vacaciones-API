import { createClient } from '@libsql/client';
import "dotenv/config";

const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function resetSolicitudes() {
  try {
    console.log("Iniciando borrado de solicitudes de vacaciones...");

    // 1. Borrar notificaciones
    await client.execute(`DELETE FROM notificaciones`);
    await client.execute(`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'notificaciones';`);
    console.log("Notificaciones borradas y secuencia reiniciada.");

    // 2. Borrar del historial las solicitudes de débito y las cancelaciones manuales
    await client.execute(`
      DELETE FROM historial_vacaciones 
      WHERE tipoRegistro = 2 OR (tipoRegistro = 1 AND diasAcreditados = 0)
    `);
    console.log("Registros de débito y cancelación borrados del historial.");

    // 3. Borrar solicitudes principales
    await client.execute(`DELETE FROM solicitudes_vacaciones`);
    await client.execute(`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'solicitudes_vacaciones';`);
    console.log("Solicitudes principales borradas y secuencia reiniciada.");

    console.log("¡Todo el flujo de solicitudes ha sido restablecido correctamente!");
  } catch (error) {
    console.error("Error al restablecer las solicitudes:", error);
  } finally {
    process.exit(0);
  }
}

resetSolicitudes();
