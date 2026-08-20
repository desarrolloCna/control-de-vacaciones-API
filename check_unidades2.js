import { createClient } from "@libsql/client";
import "dotenv/config";
const Connection = createClient({ url: process.env.DB_CATALOGOS_URL, authToken: process.env.DB_CATALOGOS_AUTH_TOKEN });
Connection.execute("SELECT * FROM unidades;").then(r => console.table(r.rows));
