import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const result = await Connection.execute("SELECT idCoordinador, nombreCoordinador, puestoCoordinador, coordinadorUnidad FROM coordinadores;");
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    }
}
run();
