import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const parseDate = (dateStr) => {
    if (!dateStr || String(dateStr).trim() === '') return null;
    let clean = String(dateStr).trim();
    if (clean.includes("al")) clean = clean.split("al")[0].trim();
    const parts = clean.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return clean;
};

const runImportFamiliares = () => {
    const results = [];
    fs.createReadStream('C:/Users/jcurruchiche/Desktop/VACAS/ARCHIVO PARA MODULO DE VACACIONES 2026.csv')
        .pipe(csv({ separator: ';', headers: false }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const empleados = results.slice(2).filter(row => row['1'] && row['1'].trim() !== '');
            console.log(`Buscando familiares para ${empleados.length} empleados.`);
            let insertedCount = 0;
            
            // Delete all previous imported family members to start fresh
            await Connection.execute("DELETE FROM familiaresDeEmpleados;");
            console.log("Tabla familiaresDeEmpleados reseteada.");
            
            for (const data of empleados) {
                let numDoc = data['1'] || '';
                numDoc = numDoc.replace(/\s/g, ''); 
                if (!numDoc) continue;

                try {
                    const resDpi = await Connection.execute({
                        sql: `SELECT inf.idInfoPersonal FROM dpiEmpleados dpi JOIN infoPersonalEmpleados inf ON dpi.idDpi = inf.idDpi WHERE dpi.numeroDocumento = ?`,
                        args: [numDoc]
                    });

                    if (resDpi.rows.length === 0) continue;
                    const idInfoPersonal = resDpi.rows[0].idInfoPersonal;

                    const tx = await Connection.transaction("write");

                    const insertFamiliar = async (nombre, parentesco, telefono, fechaNacimiento) => {
                        if (!nombre || nombre.trim() === '') return;
                        await tx.execute({
                            sql: `INSERT INTO familiaresDeEmpleados (idInfoPersonal, nombreFamiliar, telefono, parentesco, fechaNacimiento, estado) VALUES (?, ?, ?, ?, ?, 'A')`,
                            args: [idInfoPersonal, nombre.trim(), telefono ? telefono.trim() : null, parentesco.trim(), fechaNacimiento || null]
                        });
                        insertedCount++;
                    };

                    // Correct 0-based indices from the CSV
                    // 26: Padre, 27: Madre, 28: Cónyuge
                    await insertFamiliar(data['26'], 'Padre', null, null);
                    await insertFamiliar(data['27'], 'Madre', null, null);
                    await insertFamiliar(data['28'], 'Cónyuge', null, null);

                    // 29: Contacto 1 Nombre, 30: Telefono 1, 31: Parentesco 1
                    const contacto1 = data['29'];
                    if (contacto1) {
                        const parentesco1 = data['31'] || 'Contacto de Emergencia';
                        await insertFamiliar(contacto1, parentesco1, data['30'], null);
                    }
                    
                    // 32: Contacto 2 Nombre, 33: Telefono 2, 34: Parentesco 2
                    const contacto2 = data['32'];
                    if (contacto2) {
                        const parentesco2 = data['34'] || 'Contacto de Emergencia';
                        await insertFamiliar(contacto2, parentesco2, data['33'], null);
                    }

                    // Hijos: Name, DOB pairs starting at 35, 36
                    await insertFamiliar(data['35'], 'Hijo(a)', null, parseDate(data['36']));
                    await insertFamiliar(data['37'], 'Hijo(a)', null, parseDate(data['38']));
                    await insertFamiliar(data['39'], 'Hijo(a)', null, parseDate(data['40']));
                    await insertFamiliar(data['41'], 'Hijo(a)', null, parseDate(data['42']));
                    await insertFamiliar(data['43'], 'Hijo(a)', null, parseDate(data['44']));

                    await tx.commit();
                } catch (e) {
                    console.error("Error con empleado DPI " + numDoc, e.message);
                }
            }
            console.log(`Importación de familiares completada. Registros insertados: ${insertedCount}.`);
        });
};

runImportFamiliares();
