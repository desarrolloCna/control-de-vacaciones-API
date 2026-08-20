import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const tx = await Connection.transaction("write");
        
        // 1. Move employees to "Secretaría General"
        await tx.execute(`UPDATE empleados SET unidad = 'Secretaría General' WHERE idEmpleado IN (8, 9, 10)`);
        
        // 2. Add Andrea to Coordinadores if she's not there yet
        const checkCoords = await tx.execute(`SELECT * FROM coordinadores WHERE idEmpleado = 8`);
        if (checkCoords.rows.length === 0) {
            await tx.execute({
                sql: `INSERT INTO coordinadores (idEmpleado, nombreCoordinador, coordinadorUnidad, correoCoordinador, estado)
                      VALUES (?, ?, ?, ?, 'A')`,
                args: [
                    8,
                    'Andrea Estefany Monterroso De Paz',
                    'Secretaría General',
                    'amonterroso@cna.gob.gt' // Guessing email format based on Tayra Navas, Edwin Mejicano
                ]
            });
            console.log("Andrea added as coordinator for Secretaría General.");
        } else {
            console.log("Andrea is already a coordinator, updating her unit just in case.");
            await tx.execute(`UPDATE coordinadores SET coordinadorUnidad = 'Secretaría General' WHERE idEmpleado = 8`);
        }
        
        await tx.commit();
        console.log("Database setup complete.");
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
