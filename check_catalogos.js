import fs from 'fs';
const catalogos = JSON.parse(fs.readFileSync('C:/Users/jcurruchiche/Desktop/VACAS/Copia_Datos_Catalogos.json', 'utf8'));
console.log(Object.keys(catalogos));
if (catalogos.etnias) console.log("Etnias:", catalogos.etnias);
if (catalogos.etnia) console.log("Etnia:", catalogos.etnia);
