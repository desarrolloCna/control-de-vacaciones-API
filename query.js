import { createClient } from "@libsql/client";
import 'dotenv/config';

const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function main() {
    try {
        const result = await client.execute('PRAGMA table_info(historial_vacaciones);');
        console.log(result.rows);
    } catch (e) {
        console.error(e);
    }
}
main();
