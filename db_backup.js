import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";

// 1. Vacaciones App DB
const urlVaca = process.env.DB_TURSO_URL;
const tokenVaca = process.env.DB_TURSO_AUTH_TOKEN;

// 2. Catalogos DB (tomado de tu codigo fuente)
const urlCat = "libsql://catalogosbd-desarrollocna.aws-us-east-1.turso.io";
const tokenCat = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjMwOTkwOTgsImlkIjoiYzFhN2UzMmUtYmUxNC00ZWIwLTlkZTEtMjc5ZTljMTU1MTg1IiwicmlkIjoiODA1Nzg1ZjItM2NjZS00MjY1LTk1NTMtNmUwZjFmODZjY2ViIn0.51Wc06l-KFG22S3gMsBfq2_6MyFqEno89BL0fEsnoNvnC__loPjpi7VxTFLn3aP4UI3fFX9w59pT4ewa8rUUCQ";

async function dumpDB(name, url, authToken) {
    if (!url || !authToken) {
        console.log(`Faltan credenciales para ${name}, omitiendo...`);
        return;
    }
    const db = createClient({ url, authToken });
    const backupData = {};
    
    console.log(`Extrayendo datos de ${name}...`);
    const tablesResult = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'libsql_%' AND name NOT LIKE '_litestream_%'");
    
    for (const row of tablesResult.rows) {
        const tableName = row.name;
        try {
            const records = await db.execute(`SELECT * FROM ${tableName}`);
            // Convert to array of objects
            const columns = records.columns;
            const rowsObj = records.rows.map(r => {
                const rowEntry = {};
                columns.forEach((col, idx) => {
                    rowEntry[col] = r[idx];
                });
                return rowEntry;
            });
            backupData[tableName] = rowsObj;
            console.log(` - Tabla ${tableName} guardada (${rowsObj.length} registros).`);
        } catch (e) {
            console.log(` - Error leyendo tabla ${tableName}: ${e.message}`);
        }
    }
    
    const outPath = `C:/Users/jcurruchiche/Desktop/VACAS/Copia_Datos_${name}.json`;
    fs.writeFileSync(outPath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Respaldo finalizado para ${name}: Creado en ${outPath}`);
}

async function start() {
    await dumpDB("VacacionesApp", urlVaca, tokenVaca);
    await dumpDB("Catalogos", urlCat, tokenCat);
}

start().catch(console.error);
