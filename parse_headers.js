import fs from 'fs';
import csv from 'csv-parser';

const headers = [];
fs.createReadStream('C:/Users/jcurruchiche/Desktop/VACAS/ARCHIVO PARA MODULO DE VACACIONES 2026.csv')
    .pipe(csv({ separator: ';', headers: false }))
    .on('data', (data) => {
        headers.push(data);
    })
    .on('end', () => {
        const headerRow = headers[1];
        for (const key in headerRow) {
            const val = headerRow[key];
            if (val.toUpperCase().includes("ACTA")) {
                console.log(`Index ${key}: ${val}`);
            }
        }
    });
