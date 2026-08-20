import { createClient } from "@libsql/client";
import "dotenv/config";

async function resetDB() {
    console.log("🚀 Iniciando reinicio de base de datos Turso Producción...");
    console.log("Conectando a:", process.env.DB_TURSO_URL);
    
    const client = createClient({
        url: process.env.DB_TURSO_URL,
        authToken: process.env.DB_TURSO_AUTH_TOKEN
    });

    try {
        // Tablas que se van a vaciar por completo
        const fullClearTables = [
            "bitacora_cambios",
            "notificaciones",
            "historial_vacaciones",
            "solicitudes_vacaciones",
            "vacaciones_especiales",
            "suspensiones"
        ];

        // Tablas de las que se borrarán los empleados con ID > 2 (para conservar administradores)
        const partialClearTables = {
            "usuarios": "idUsuario > 2",
            "empleados": "idEmpleado > 2",
            "infoPersonalEmpleados": "idInfoPersonal > 2",
            "dpiEmpleados": "idDpi > 2",
            "coordinadores": "idEmpleado > 2",
            "datosMedicos": "idInfoPersonal > 2",
            "familiaresDeEmpleados": "idInfoPersonal > 2",
            "nivelEducativo": "idInfoPersonal > 2",
            "pertenenciaSociolinguistica": "idInfoPersonal > 2"
        };

        // 1. Borrar todas las tablas completas
        for (const table of fullClearTables) {
            console.log(`Borrando todos los registros de: ${table}...`);
            await client.execute(`DELETE FROM ${table};`);
            // Reiniciar ID a 0
            await client.execute(`UPDATE sqlite_sequence SET seq = 0 WHERE name = '${table}';`);
        }

        // 2. Borrar parcialmente las tablas con usuarios
        for (const [table, condition] of Object.entries(partialClearTables)) {
            console.log(`Borrando registros de ${table} donde ${condition}...`);
            await client.execute(`DELETE FROM ${table} WHERE ${condition};`);
            // Ajustar ID a 2
            await client.execute(`UPDATE sqlite_sequence SET seq = 2 WHERE name = '${table}';`);
        }

        console.log("✅ Reinicio de IDs y datos completado con éxito.");
    } catch (error) {
        console.error("❌ Error reiniciando base de datos:", error);
    }
}

resetDB();
