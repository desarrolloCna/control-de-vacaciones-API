import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const run = async () => {
    try {
        const tx = await Connection.transaction("write");
        await tx.execute(`
            UPDATE empleados 
            SET unidad = 'Unidad de Comunicación Social' 
            WHERE idInfoPersonal IN (
                SELECT idInfoPersonal FROM infoPersonalEmpleados 
                WHERE primerNombre LIKE '%Lilian%' AND primerApellido LIKE '%Ajcá%'
                   OR primerNombre LIKE '%Juan%' AND primerApellido LIKE '%Tzitá%'
                   OR primerNombre LIKE '%Rudy%' AND primerApellido LIKE '%González%'
            )
        `);
        await tx.commit();
        console.log("Updated Comunicación Social");
    } catch(e) {
        console.error(e);
    }
};
run();
