import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_CATALOGOS_URL,
    authToken: process.env.DB_CATALOGOS_AUTH_TOKEN
});

async function run() {
    try {
        const result = await Connection.execute("SELECT * FROM comunidadesLinguisticas;");
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    }
}
run();
