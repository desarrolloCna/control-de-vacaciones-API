import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const query = "SELECT e.idEmpleado, e.unidad, e.puesto, i.primerNombre, i.primerApellido FROM empleados e JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal WHERE e.unidad LIKE '%Secretar%' OR e.unidad = 'Dirección General';";
        const res = await Connection.execute(query);
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    }
}
run();
