import { createClient } from "@libsql/client";
import "dotenv/config";

const db = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function main() {
    const res = await db.execute(`
        SELECT c.idCoordinador, e.idEmpleado, e.puesto, c.coordinadorUnidad, c.nombreCoordinador 
        FROM coordinadores c
        JOIN empleados e ON c.idEmpleado = e.idEmpleado
        WHERE c.estado = 'A';
    `);
    console.table(res.rows);
}
main();
