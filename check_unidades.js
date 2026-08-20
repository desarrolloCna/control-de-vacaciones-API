import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const query = "SELECT DISTINCT unidad FROM empleados;";
        const res = await Connection.execute(query);
        console.log("Unidades en empleados:");
        res.rows.forEach(r => console.log(r.unidad));
    } catch (e) {
        console.error(e);
    }
}
run();
