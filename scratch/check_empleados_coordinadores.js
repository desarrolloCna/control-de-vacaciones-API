import { createClient } from "@libsql/client";
import "dotenv/config";

const db = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function main() {
    const res = await db.execute(`
        SELECT e.idEmpleado, e.puesto, e.unidad, i.primerNombre, i.primerApellido
        FROM empleados e
        JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
        WHERE e.puesto LIKE '%Director%' OR e.puesto LIKE '%Coordinador%' OR e.puesto LIKE '%Jefe%';
    `);
    console.table(res.rows);
}
main();
