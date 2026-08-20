import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const CatalogConnection = createClient({
    url: process.env.DB_CATALOGOS_URL,
    authToken: process.env.DB_CATALOGOS_AUTH_TOKEN
});

const normalizeStr = (str) => {
    if (!str) return "";
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/´/g, "").replace(/'/g, "");
};

async function run() {
    try {
        const catResult = await CatalogConnection.execute("SELECT * FROM comunidadesLinguisticas");
        const comunidades = catResult.rows;

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

                    let strComunidad = row['Comunidad Lingúística'] || '';
                    if (!strComunidad || strComunidad.trim() === '') continue;
                    
                    if (strComunidad.toLowerCase().includes('no aplica') || strComunidad.toLowerCase().includes('ningun')) {
                        strComunidad = 'Español';
                    }

                    // Encontrar ID
                    const normalizedSearch = normalizeStr(strComunidad);
                    const match = comunidades.find(c => {
                        const cName = normalizeStr(c.tipoComunidad);
                        return cName === normalizedSearch || normalizedSearch.includes(cName) || cName.includes(normalizedSearch);
                    });

                    if (match) {
                        foundNames++;
                        const idComunidad = match.idComunidadLinguistica;

                        // Buscar empleado
                        const emp = await tx.execute({
                            sql: "SELECT ip.idInfoPersonal FROM infoPersonalEmpleados ip INNER JOIN dpiEmpleados d ON d.idDpi = ip.idDpi WHERE d.numeroDocumento = ?",
                            args: [dpi]
                        });

                        if (emp.rows.length > 0) {
                            const idInfoPersonal = emp.rows[0].idInfoPersonal;
                            await tx.execute({
                                sql: "UPDATE pertenenciaSociolinguistica SET comunidadLinguistica = ? WHERE idInfoPersonal = ?",
                                args: [idComunidad, idInfoPersonal]
                            });
                            successCount++;
                        }
                    }
                }
                
                await tx.commit();
                console.log(`Finalizado. Encontradas: ${foundNames}. Actualizadas: ${successCount}`);
            });
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
