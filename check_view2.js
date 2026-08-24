import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  const res = await client.execute("SELECT sql FROM sqlite_master WHERE type='view' AND name='HistorialVacaciones'");
  console.log(res.rows[0].sql);
}

run().catch(console.error);
