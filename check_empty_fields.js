import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const result = await Connection.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN numeroContrato IS NULL OR numeroContrato = '' THEN 1 ELSE 0 END) as sin_contrato,
                SUM(CASE WHEN numeroActa IS NULL OR numeroActa = '' THEN 1 ELSE 0 END) as sin_acta,
                SUM(CASE WHEN numeroAcuerdo IS NULL OR numeroAcuerdo = '' THEN 1 ELSE 0 END) as sin_acuerdo,
                SUM(CASE WHEN renglon IS NULL OR renglon = '' THEN 1 ELSE 0 END) as sin_renglon,
                SUM(CASE WHEN idInfoPersonal IS NULL THEN 1 ELSE 0 END) as sin_info_personal
            FROM empleados;
        `);
        console.log("=== EMPLEADOS ===");
        console.table(result.rows);

        const resultInfo = await Connection.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN etnia IS NULL OR etnia = '' THEN 1 ELSE 0 END) as sin_etnia,
                SUM(CASE WHEN comunidadLinguistica IS NULL OR comunidadLinguistica = '' THEN 1 ELSE 0 END) as sin_comunidad
            FROM pertenenciaSociolinguistica;
        `);
        console.log("=== PERTENENCIA SOCIOLINGUISTICA ===");
        console.table(resultInfo.rows);

    } catch (e) {
        console.error("Error:", e);
    }
}
run();
