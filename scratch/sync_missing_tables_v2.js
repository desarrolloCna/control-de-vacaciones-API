import { createClient } from "@libsql/client";
import "dotenv/config";

const PROD_URL = "libsql://vacacionesapp-desarrollocna.aws-us-east-1.turso.io";
const PROD_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2OTgyNTgsImlkIjoiYjk5MDQ3YjctNDcwNy00OWQyLWE3MjgtNmM2N2Q4YWQ3YzVmIiwicmlkIjoiMDBjNTUyNWMtYjM4Yi00NWVjLWFiMDYtMTQzZjYxMDMzNGUyIn0.vRuaC-4K7HUJG37kGgUB-NouZSLSRkiKtrsxQziRW3xS2HstbLeaxKI0-5m5u_BSKQpYJQYUgG0b_VPrvsjwDQ";
const LOCAL_URL = "file:./vacaciones.db";

async function syncTable(tableName, prodClient, localClient) {
    console.log(`Sincronizando tabla: ${tableName}...`);
    
    // 1. Obtener esquema
    const schemaRes = await prodClient.execute(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
    if (schemaRes.rows.length === 0) {
        console.warn(`⚠️ Tabla ${tableName} no encontrada en producción.`);
        return;
    }
    
    const createSql = schemaRes.rows[0].sql;
    
    // 2. Crear local
    await localClient.execute(`DROP TABLE IF EXISTS ${tableName}`);
    await localClient.execute(createSql);
    
    // 3. Obtener datos
    const dataRes = await prodClient.execute(`SELECT * FROM ${tableName}`);
    if (dataRes.rows.length === 0) {
        console.log(` - Tabla ${tableName} vacía.`);
        return;
    }
    
    // 4. Insertar datos (uno por uno para evitar problemas con tipos o arrays grandes)
    const columns = dataRes.columns;
    const placeholders = columns.map(() => "?").join(", ");
    const insertSql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
    
    let count = 0;
    for (const row of dataRes.rows) {
        try {
            // Limpiar valores null o undefined si es necesario, pero libsql maneja nulls bien.
            // Asegurarse de pasar el array de valores correcto.
            const values = Array.isArray(row) ? row : Object.values(row);
            await localClient.execute({
                sql: insertSql,
                args: values
            });
            count++;
        } catch (e) {
            console.error(`  - Error en fila de ${tableName}: ${e.message}`);
        }
    }
    console.log(` ✅ ${tableName} sincronizada (${count} registros).`);
}

async function start() {
    const prod = createClient({ url: PROD_URL, authToken: PROD_TOKEN });
    const local = createClient({ url: LOCAL_URL });
    
    const tables = [
        "bitacora_cambios",
        "config_params",
        "dias_festivos",
        "notificaciones",
        "vacaciones_especiales"
    ];
    
    for (const t of tables) {
        try {
            await syncTable(t, prod, local);
        } catch (e) {
            console.error(`❌ Fallo crítico en ${t}: ${e.message}`);
        }
    }
    
    console.log("\nSincronización de tablas faltantes completada.");
    process.exit(0);
}

start();
