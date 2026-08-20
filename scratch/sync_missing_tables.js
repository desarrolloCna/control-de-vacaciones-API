import { createClient } from "@libsql/client";
import "dotenv/config";

// Credenciales antiguas (de producción) - Tomadas del historial
const PROD_URL = "libsql://vacacionesapp-desarrollocna.aws-us-east-1.turso.io";
const PROD_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2OTgyNTgsImlkIjoiYjk5MDQ3YjctNDcwNy00OWQyLWE3MjgtNmM2N2Q4YWQ3YzVmIiwicmlkIjoiMDBjNTUyNWMtYjM4Yi00NWVjLWFiMDYtMTQzZjYxMDMzNGUyIn0.vRuaC-4K7HUJG37kGgUB-NouZSLSRkiKtrsxQziRW3xS2HstbLeaxKI0-5m5u_BSKQpYJQYUgG0b_VPrvsjwDQ";

const LOCAL_URL = "file:./vacaciones.db";

async function syncTable(tableName, prodClient, localClient) {
    console.log(`Sincronizando tabla: ${tableName}...`);
    
    // 1. Obtener esquema de la tabla
    const schemaRes = await prodClient.execute(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
    if (schemaRes.rows.length === 0) {
        console.warn(`⚠️ Tabla ${tableName} no encontrada en producción.`);
        return;
    }
    
    const createSql = schemaRes.rows[0].sql;
    
    // 2. Crear tabla en local (si no existe)
    try {
        await localClient.execute(`DROP TABLE IF EXISTS ${tableName}`);
        await localClient.execute(createSql);
    } catch (e) {
        console.error(`❌ Error creando tabla ${tableName} en local: ${e.message}`);
        return;
    }
    
    // 3. Obtener datos de producción
    const dataRes = await prodClient.execute(`SELECT * FROM ${tableName}`);
    if (dataRes.rows.length === 0) {
        console.log(` - Tabla ${tableName} está vacía.`);
        return;
    }
    
    // 4. Insertar datos en local
    const columns = dataRes.columns;
    const placeholders = columns.map(() => "?").join(", ");
    const insertSql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
    
    for (const row of dataRes.rows) {
        try {
            await localClient.execute({
                sql: insertSql,
                args: row
            });
        } catch (e) {
            console.error(`  - Error insertando fila en ${tableName}: ${e.message}`);
        }
    }
    console.log(` ✅ Tabla ${tableName} sincronizada (${dataRes.rows.length} registros).`);
}

async function startSync() {
    const prod = createClient({ url: PROD_URL, authToken: PROD_TOKEN });
    const local = createClient({ url: LOCAL_URL });
    
    // Tablas que faltan o fallaron
    const tablesToSync = [
        "bitacora_cambios",
        "config_params",
        "notificaciones",
        "vacaciones_especiales",
        "dias_festivos"
    ];
    
    for (const table of tablesToSync) {
        await syncTable(table, prod, local);
    }
    
    console.log("\nSincronización finalizada.");
    process.exit(0);
}

startSync().catch(console.error);
