import { createClient } from "@libsql/client";
import "dotenv/config";

async function verifyConstraints() {
    const db = createClient({ url: process.env.DB_TURSO_URL });
    
    console.log("Checking Solicitudes Vacaciones schema:");
    const res = await db.execute("SELECT sql FROM sqlite_master WHERE name='solicitudes_vacaciones'");
    console.log(res.rows[0].sql);

    console.log("\nChecking Foreign Key list for solicitudes_vacaciones:");
    const fks = await db.execute("PRAGMA foreign_key_list(solicitudes_vacaciones)");
    fks.rows.forEach(fk => {
        console.log(` - ${fk.from} -> ${fk.table}(${fk.to})`);
    });

    console.log("\nChecking Primary Key for usuarios:");
    const pks = await db.execute("PRAGMA table_info(usuarios)");
    pks.rows.forEach(col => {
        if (col.pk) console.log(` - ${col.name} (PK)`);
    });
}

verifyConstraints().catch(console.error);
