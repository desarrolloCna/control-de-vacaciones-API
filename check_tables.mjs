import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:src/apivacaciones/dao/connection/vacationapp.db' });
async function run() {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.table(result.rows);
}
run();
