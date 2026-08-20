import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const results = [];
        fs.createReadStream('C:/Users/jcurruchiche/Desktop/VACAS/ARCHIVO PARA MODULO DE VACACIONES 2026.csv')
            .pipe(csv({ separator: ';', skipLines: 1 }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                let successCount = 0;
                let foundNames = 0;
                
                const tx = await Connection.transaction("write");

                for (const row of results) {
                    const dpi = (row['Número de Documento de Identificación:'] || '').replace(/\s/g, '');
                    if (!dpi) continue;

                    const numAcuerdo = row['ACUERDO'] || '';
                    if (!numAcuerdo || numAcuerdo.trim() === '') continue;
                    
                    foundNames++;

                    // Buscar empleado
                    const emp = await tx.execute({
                        sql: "SELECT e.idEmpleado FROM empleados e INNER JOIN infoPersonalEmpleados ip ON ip.idInfoPersonal = e.idInfoPersonal INNER JOIN dpiEmpleados d ON d.idDpi = ip.idDpi WHERE d.numeroDocumento = ?",
                        args: [dpi]
                    });

                    if (emp.rows.length > 0) {
                        const idEmpleado = emp.rows[0].idEmpleado;
                        await tx.execute({
                            sql: "UPDATE empleados SET numeroAcuerdo = ? WHERE idEmpleado = ?",
                            args: [numAcuerdo, idEmpleado]
                        });
                        successCount++;
                    }
                }
                
                await tx.commit();
                console.log(`Finalizado ACUERDO. Encontrados: ${foundNames}. Actualizados: ${successCount}`);
            });
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
