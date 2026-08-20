import fs from 'fs';
import csv from 'csv-parser';
import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const runUpdate = () => {
    const results = [];
    fs.createReadStream('C:/Users/jcurruchiche/Desktop/VACAS/ARCHIVO PARA MODULO DE VACACIONES 2026.csv')
        .pipe(csv({ separator: ';', headers: false }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const empleadosCsv = results.slice(2).filter(row => row['1'] && row['1'].trim() !== '');
            console.log(`Se procesarán ${empleadosCsv.length} empleados.`);
            
            try {
                const tx = await Connection.transaction("write");
                let updates = 0;
                for (const row of empleadosCsv) {
                    const dpiRaw = row['1'] || '';
                    const dpi = dpiRaw.replace(/\s/g, '');
                    const contratoRaw = row['91'] || '';
                    const contrato = contratoRaw.trim() === 'N/A' || contratoRaw.trim() === '' ? null : contratoRaw.trim();
                    
                    if (contrato) {
                        const q = `
                            UPDATE empleados 
                            SET numeroContrato = ? 
                            WHERE idInfoPersonal IN (
                                SELECT idInfoPersonal 
                                FROM infoPersonalEmpleados 
                                WHERE idDpi IN (
                                    SELECT idDpi FROM dpiEmpleados WHERE numeroDocumento = ?
                                )
                            )
                        `;
                        const res = await tx.execute({
                            sql: q,
                            args: [contrato, dpi]
                        });
                        updates++;
                    }
                }
                await tx.commit();
                console.log(`Se insertó número de contrato para ${updates} empleados con datos válidos.`);
            } catch (e) {
                console.error("Error:", e);
            }
        });
};

runUpdate();
