import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_CATALOGOS_URL,
    authToken: process.env.DB_CATALOGOS_AUTH_TOKEN
});

async function run() {
    try {
        const tables = await Connection.execute("SELECT name FROM sqlite_master WHERE type='table';");
        console.table(tables.rows);

        const result = await Connection.execute("SELECT * FROM tipoComunidadLinguistica;").catch(() => ({rows:[]}));
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    }
}
run();
