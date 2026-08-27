import { createClient } from '@libsql/client';
import "dotenv/config";
const client = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});
async function run() {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.table(result.rows);
}
run();
