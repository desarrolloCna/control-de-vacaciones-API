import fs from 'fs';
import csv from 'csv-parser';

fs.createReadStream('C:/Users/jcurruchiche/Desktop/VACAS/ARCHIVO PARA MODULO DE VACACIONES 2026.csv')
  .pipe(csv({ separator: ';' }))
  .on('headers', (headers) => {
    headers.forEach((header, i) => console.log(`[${i + 1}] ${header}`));
  })
  .on('data', () => process.exit(0));
