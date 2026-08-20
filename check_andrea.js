import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const query = "SELECT e.idEmpleado, e.unidad, e.puesto, i.primerNombre, i.segundoNombre, i.primerApellido, i.segundoApellido FROM empleados e JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal WHERE i.primerNombre LIKE '%Andrea%' OR i.primerApellido LIKE '%Monterroso%' OR i.segundoApellido LIKE '%Monterroso%';";
        const res = await Connection.execute(query);
        console.log("Andrea:", res.rows);
        
        const qCoords = "SELECT * FROM coordinadores;";
        const resCoords = await Connection.execute(qCoords);
        console.log("Coords:", resCoords.rows);
    } catch (e) {
        console.error(e);
    }
}
run();
