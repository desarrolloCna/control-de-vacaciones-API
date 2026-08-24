import { createClient } from "@libsql/client";
import 'dotenv/config';

const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function main() {
    try {
        const result = await client.execute("SELECT sql FROM sqlite_master WHERE name='HistorialVacaciones'");
        console.log(result.rows[0].sql);
    } catch (e) {
        console.error(e);
    }
}
main();
