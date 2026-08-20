import { Connection } from "./src/apivacaciones/dao/connection/conexionsqlite.dao.js";

async function run() {
  const query = "SELECT name FROM sqlite_master WHERE type='table';";
  const result = await Connection.execute(query);
  console.log(result.rows.map(r => r.name));
}
run();
