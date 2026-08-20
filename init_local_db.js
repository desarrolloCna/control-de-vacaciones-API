import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";
import path from "path";

const BACKUP_DIR = "C:/Users/jcurruchiche/Desktop/Respaldos_BD_Vacaciones";

async function runSqlFile(dbClient, filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
        return;
    }

    console.log(`Executing ${path.basename(filePath)}...`);
    const sql = fs.readFileSync(filePath, "utf8");
    
    // Split by semicolon but be careful with multi-line statements. 
    // For simplicity with these backups, we can try executing the whole block if it's not too huge,
    // or splitting by ';'
    const statements = sql.split(";").filter(s => s.trim().length > 0);
    
    for (let statement of statements) {
        try {
            await dbClient.execute(statement);
        } catch (error) {
            // Some errors like "table already exists" might happen if we rerun
            if (!error.message.includes("already exists")) {
                console.error(`❌ Error en statement: ${statement.substring(0, 50)}...`);
                console.error(`   Mensaje: ${error.message}`);
            }
        }
    }
}

async function init() {
    console.log("🚀 Iniciando inicialización de bases de datos locales...");

    // 1. Vacaciones DB
    const clientVaca = createClient({ url: process.env.DB_TURSO_URL });
    console.log(`\n--- Configurando Vacaciones (${process.env.DB_TURSO_URL}) ---`);
    await runSqlFile(clientVaca, path.join(BACKUP_DIR, "tablas_vacacionesapp.sql_temp"));
    await runSqlFile(clientVaca, path.join(BACKUP_DIR, "insert_vacacionesapp.sql_temp"));
    await runSqlFile(clientVaca, path.join(BACKUP_DIR, "insert_admin.sql"));

    // 2. Catalogos DB
    const clientCat = createClient({ url: process.env.DB_CATALOGOS_URL });
    console.log(`\n--- Configurando Catálogos (${process.env.DB_CATALOGOS_URL}) ---`);
    await runSqlFile(clientCat, path.join(BACKUP_DIR, "tables_catalogos.sql"));
    await runSqlFile(clientCat, path.join(BACKUP_DIR, "insert_catalogos.sql"));

    console.log("\n✅ Inicialización completada.");
    process.exit(0);
}

init().catch(err => {
    console.error("\n💥 Error fatal durante la inicialización:");
    console.error(err);
    process.exit(1);
});
