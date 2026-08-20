import { createClient } from "@libsql/client";
import "dotenv/config";

async function run() {
    const client = createClient({
        url: process.env.DB_TURSO_URL,
        authToken: process.env.DB_TURSO_AUTH_TOKEN
    });
    
    await client.execute(`UPDATE empleados SET estado = 'A'`);
    await client.execute(`UPDATE usuarios SET estadoUsuario = 'A'`);
    await client.execute(`UPDATE dpiEmpleados SET estado = 'A'`);
    console.log('Fixed states');
}
run();
