import { createClient } from "@libsql/client";
import "dotenv/config";

async function checkTables() {
    console.log("Conectando a:", process.env.DB_TURSO_URL);
    const client = createClient({
        url: process.env.DB_TURSO_URL,
        authToken: process.env.DB_TURSO_AUTH_TOKEN
    });

    try {
        const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
        console.log("Tablas encontradas:");
        res.rows.forEach(row => console.log(`- ${row.name}`));
    } catch (error) {
        console.error("Error consultando tablas:", error);
    }
}

checkTables();
