import fs from 'fs';
import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const catalogos = JSON.parse(fs.readFileSync('C:/Users/jcurruchiche/Desktop/VACAS/Copia_Datos_Catalogos.json', 'utf8'));
console.log("Pueblo:", catalogos.puebloPerteneciente);
console.log("Comunidades:", catalogos.comunidadesLinguisticas.slice(0, 5));

async function run() {
    try {
        const tx = await Connection.transaction("write");
        // 1. Clean duplicates from familiaresDeEmpleados.
        // We will keep the row with the max idFamiliar for each (idInfoPersonal, nombreFamiliar, parentesco)
        await tx.execute(`
            DELETE FROM familiaresDeEmpleados 
            WHERE idFamiliar NOT IN (
                SELECT MAX(idFamiliar) 
                FROM familiaresDeEmpleados 
                GROUP BY idInfoPersonal, nombreFamiliar, parentesco
            );
        `);
        console.log("Deleted duplicated familiares.");

        // 2. We can see what we need to map for etnia.
        await tx.commit();
    } catch (e) {
        console.error(e);
    }
}
run();
