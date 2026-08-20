import { createClient } from "@libsql/client";
import "dotenv/config";

async function checkTables() {
    console.log("Conectando a Turso:", process.env.DB_TURSO_URL);
    const client = createClient({
        url: process.env.DB_TURSO_URL,
        authToken: process.env.DB_TURSO_AUTH_TOKEN
    });

    try {
        const res = await client.execute("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'libsql_%';");
        console.log("\n--- ESTRUCTURA DE TABLAS EN TURSO ---");
        res.rows.forEach(row => {
            console.log(`\nTABLA: ${row.name}`);
            console.log(row.sql);
        });
    } catch (error) {
        console.error("Error consultando tablas:", error);
    }
}

checkTables();
