import { createClient } from "@libsql/client";
import "dotenv/config";

async function listTables() {
    const db = createClient({ url: process.env.DB_TURSO_URL });
    const result = await db.execute("SELECT name, type FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'");
    console.log("Objetos en vacaciones.db:");
    result.rows.forEach(row => console.log(` - [${row.type}] ${row.name}`));
    
    const db2 = createClient({ url: process.env.DB_CATALOGOS_URL });
    const result2 = await db2.execute("SELECT name, type FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'");
    console.log("\nObjetos en catalogos.db:");
    result2.rows.forEach(row => console.log(` - [${row.type}] ${row.name}`));
}

listTables().catch(console.error);
