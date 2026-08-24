import { createClient } from "@libsql/client";
import "dotenv/config";

const db = createClient({
    url: process.env.DB_TURSO_URL || "file:./database.sqlite",
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function main() {
    console.log("Looking for duplicate debits...");
    const res = await db.execute(`
        SELECT idEmpleado, idSolicitud, periodo, COUNT(*) as count, GROUP_CONCAT(idHistorial) as historiales
        FROM historial_vacaciones
        WHERE tipoRegistro = 2
        GROUP BY idEmpleado, idSolicitud, periodo
        HAVING count > 1
    `);
    
    const duplicates = res.rows;
    console.log('Duplicates found:', duplicates);

    let deletedCount = 0;
    for (const dup of duplicates) {
        const ids = dup.historiales.split(',');
        const idsToDelete = ids.slice(1);
        
        for (const id of idsToDelete) {
            await db.execute('DELETE FROM historial_vacaciones WHERE idHistorial = ?', [id]);
            deletedCount++;
            console.log(`Deleted duplicate debit idHistorial: ${id}`);
        }
    }

    console.log(`Total duplicate debits deleted: ${deletedCount}`);
}

main().catch(console.error);
