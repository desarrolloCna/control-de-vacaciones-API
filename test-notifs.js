import { Connection } from "./src/apivacaciones/dao/connection/conexionsqlite.dao.js";

async function checkNotifs() {
  try {
    const res = await Connection.execute("SELECT * FROM notificaciones;");
    console.log("Notificaciones:", res.rows);
  } catch (err) {
    console.error("Error:", err);
  }
}
checkNotifs();
