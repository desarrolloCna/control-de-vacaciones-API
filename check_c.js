import { createClient } from "@libsql/client";
import "dotenv/config";
const Connection = createClient({ url: process.env.DB_TURSO_URL, authToken: process.env.DB_TURSO_AUTH_TOKEN });
Connection.execute("SELECT * FROM coordinadores;").then(r => console.table(r.rows));
