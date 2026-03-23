import { createClient } from "@libsql/client";

import "dotenv/config";

// Crear cliente de conexión a SQLite usando @libsql/client
export const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});
