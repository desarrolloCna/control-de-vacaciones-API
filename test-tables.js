import { Connection } from "./src/apivacaciones/dao/connection/conexionsqlite.dao.js";

async function checkTables() {
  try {
    const res = await Connection.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Tables in database:", res.rows.map(r => r.name).join(", "));
  } catch (err) {
    console.error("Error:", err);
  }
}
checkTables();
