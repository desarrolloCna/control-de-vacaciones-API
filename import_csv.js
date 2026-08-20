import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";
import csv from "csv-parser";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const getCatalogos = () => {
    return JSON.parse(fs.readFileSync('C:/Users/jcurruchiche/Desktop/VACAS/Copia_Datos_Catalogos.json', 'utf8'));
};

const catalogos = getCatalogos();

const findCatalogId = (tableName, columnName, idColumn, valueToFind) => {
    if (!valueToFind) return null;
    const items = catalogos[tableName] || [];
    const searchVal = String(valueToFind).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const found = items.find(item => {
        const catalogVal = String(item[columnName]).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return catalogVal === searchVal || catalogVal.includes(searchVal) || searchVal.includes(catalogVal);
    });
    return found ? found[idColumn] : null;
};

const parseDate = (dateStr) => {
    if (!dateStr || String(dateStr).trim() === '') return null;
    let clean = String(dateStr).trim();
    if (clean.includes("al")) {
        clean = clean.split("al")[0].trim();
    }
    const parts = clean.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return clean;
};

const runImport = () => {
    const results = [];
    fs.createReadStream('C:/Users/jcurruchiche/Desktop/VACAS/ARCHIVO PARA MODULO DE VACACIONES 2026.csv')
        .pipe(csv({ separator: ';', headers: false }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            const empleados = results.slice(2).filter(row => row['1'] && row['1'].trim() !== '');
            console.log(`Se procesarán ${empleados.length} empleados.`);
            let successCount = 0;
            
            for (const data of empleados) {
                let primerNombre = (data['4'] || '').trim();
                let segundoNombre = (data['5'] || '').trim();
                let tercerNombre = (data['6'] || '').trim();
                let primerApellido = (data['7'] || '').trim();
                let segundoApellido = (data['8'] || '').trim();
                let apellidoCasada = (data['9'] || '').trim();
                
                if (!primerNombre && !primerApellido) {
                    const fullName = data['87'] || '';
                    if (fullName) {
                        const parts = fullName.split(' ');
                        primerNombre = parts[0] || 'User';
                        primerApellido = parts.length > 1 ? parts[1] : '';
                    }
                }
                
                if (!primerNombre) primerNombre = 'User';
                if (!primerApellido) primerApellido = 'Tmp';

                const username = `${primerNombre.toLowerCase()}.${primerApellido.toLowerCase()}`;
                const passHash = '$2a$10$XmX/p0M2bI9V.qBXZ9sI2O/aP5H9aI.wHlVq7Tq5q5q5q5q5q5q5q';
                
                let idRol = 4;
                const puestoStr = (data['76'] || '').toLowerCase();
                const unidadStr = (data['77'] || '').toLowerCase();
                if (puestoStr.includes('coordinador') || puestoStr.includes('director')) idRol = 5;
                if (unidadStr.includes('recursos humanos')) idRol = 3;

                try {
                    const tx = await Connection.transaction("write");

                    let numDoc = data['1'] || '';
                    numDoc = numDoc.replace(/\s/g, ''); 
                    if (!numDoc) numDoc = 'PENDIENTE-' + Math.random().toString(36).substring(7);

                    const fechaVencDpi = parseDate(data['17']);
                    const dpiRes = await tx.execute({
                        sql: `INSERT INTO dpiEmpleados (numeroDocumento, departamentoExpedicion, municipioExpedicion, fechaVencimientoDpi, estado) 
                              VALUES (?, ?, ?, ?, 'A') RETURNING idDpi`,
                        args: [
                            numDoc,
                            findCatalogId('departamentos', 'departamento', 'IdDepartamento', data['2']),
                            findCatalogId('municipios', 'municipio', 'idMunicipio', data['3']),
                            fechaVencDpi
                        ]
                    });
                    const idDpi = dpiRes.rows[0].idDpi;

                    let estadoCivilStr = data['16'] || '';
                    if (estadoCivilStr.includes('Soltero')) estadoCivilStr = 'Soltero';
                    else if (estadoCivilStr.includes('Casado')) estadoCivilStr = 'Casado';
                    else if (estadoCivilStr.includes('Divorciado')) estadoCivilStr = 'Divorciado';
                    else if (estadoCivilStr.includes('Viudo')) estadoCivilStr = 'Viudo';

                    let generoStr = data['15'] || '';
                    if (generoStr.includes('Hombre')) generoStr = 'Masculino';
                    else if (generoStr.includes('Mujer')) generoStr = 'Femenino';

                    const infoRes = await tx.execute({
                        sql: `INSERT INTO infoPersonalEmpleados (
                                idDpi, primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, apellidoCasada, 
                                numeroCelular, correoPersonal, direccionResidencia, estadoCivil, Genero, nit, numAfiliacionIgss, numeroLicencia, tipoLicencia, 
                                departamentoNacimiento, municipioNacimiento, fechaNacimiento, estado
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'A') RETURNING idInfoPersonal`,
                        args: [
                            idDpi,
                            primerNombre, segundoNombre, tercerNombre, primerApellido, segundoApellido, apellidoCasada,
                            data['21'] || '', data['19'] || '', data['18'] || '',
                            estadoCivilStr,
                            generoStr,
                            data['22'] || '', data['23'] || '', data['24'] || '', data['25'] || '',
                            findCatalogId('departamentos', 'departamento', 'IdDepartamento', data['12']),
                            findCatalogId('municipios', 'municipio', 'idMunicipio', data['13']),
                            parseDate(data['10'])
                        ]
                    });
                    const idInfoPersonal = infoRes.rows[0].idInfoPersonal;

                    let nivel = data['51'] || data['49'] || data['47'] || data['45'] || '';
                    let ultimoNivel = data['52'] || data['50'] || data['48'] || data['46'] || '';
                    let anio = data['52'] || data['54'] || '';
                    if (anio.length === 4) anio = `${anio}-01-01`; // Si es solo el año 2010, convertir a 2010-01-01
                    else anio = parseDate(anio) || '2000-01-01'; // Default

                    await tx.execute({
                        sql: `INSERT INTO nivelEducativo (idInfoPersonal, nivelDeEstudios, ultimoNivelAlcanzado, añoUltimoNivelCursado, Profesion, numeroColegiado, fechaColegiacion)
                              VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        args: [
                            idInfoPersonal,
                            nivel,
                            ultimoNivel,
                            anio,
                            data['55'] || '',
                            data['57'] || '',
                            parseDate(data['56'])
                        ]
                    });

                    await tx.execute({
                        sql: `INSERT INTO pertenenciaSociolinguistica (idInfoPersonal, etnia, comunidadLinguistica) VALUES (?, ?, ?)`,
                        args: [
                            idInfoPersonal,
                            findCatalogId('puebloPerteneciente', 'pueblo', 'idPuebloPerteneciente', data['68']),
                            findCatalogId('comunidadLinguistica', 'tipoComunidad', 'idComunidadLinguistica', data['69'])
                        ]
                    });

                    let discapacidad = data['71'] || 'No';
                    if(discapacidad.toLowerCase().includes('ninguna')) discapacidad = 'No';
                    
                    let tomaMedicina = data['74'] || 'No';
                    if(tomaMedicina.trim() === '') tomaMedicina = 'No';

                    let tipoSangre = data['72'] || '';
                    if(tipoSangre.includes('positivo')) {
                        if(tipoSangre.includes('A')) tipoSangre = 'A+';
                        if(tipoSangre.includes('B')) tipoSangre = 'B+';
                        if(tipoSangre.includes('O')) tipoSangre = 'O+';
                        if(tipoSangre.includes('AB')) tipoSangre = 'AB+';
                    } else if(tipoSangre.includes('negativo')) {
                        if(tipoSangre.includes('A')) tipoSangre = 'A-';
                        if(tipoSangre.includes('B')) tipoSangre = 'B-';
                        if(tipoSangre.includes('O')) tipoSangre = 'O-';
                        if(tipoSangre.includes('AB')) tipoSangre = 'AB-';
                    }

                    await tx.execute({
                        sql: `INSERT INTO datosMedicos (idInfoPersonal, discapacidad, tipoDiscapacidad, tipoSangre, condicionMedica, tomaMedicina, sufreAlergia)
                              VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        args: [
                            idInfoPersonal,
                            discapacidad,
                            findCatalogId('discapacidades', 'tipoDiscapacidad', 'idDiscapacidad', data['70']),
                            tipoSangre,
                            data['73'] || '',
                            tomaMedicina,
                            data['75'] || ''
                        ]
                    });

                    let salario = 0;
                    const strSalario = (data['92'] || '').replace('Q', '').replace(/,/g, '').trim();
                    if(strSalario && !isNaN(parseFloat(strSalario))) {
                        salario = parseFloat(strSalario);
                    }
                    
                    const fechaIngresoDefecto = parseDate(data['88']) || '2026-01-01';

                    const empRes = await tx.execute({
                        sql: `INSERT INTO empleados (
                                idInfoPersonal, puesto, salario, correoInstitucional, unidad, renglon, numeroAcuerdo, fechaIngreso, estado
                              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'A') RETURNING idEmpleado`,
                        args: [
                            idInfoPersonal,
                            data['76'] || '',
                            salario,
                            data['78'] || '',
                            data['77'] || '',
                            data['89'] || '',
                            data['90'] || '',
                            fechaIngresoDefecto
                        ]
                    });
                    const idEmpleado = empRes.rows[0].idEmpleado;

                    await tx.execute({
                        sql: `INSERT INTO usuarios (idEmpleado, idRol, usuario, pass, requiereCambioPass, estadoUsuario) VALUES (?, ?, ?, ?, ?, 'A')`,
                        args: [idEmpleado, idRol, username + idEmpleado, passHash, 1]
                    });
                    
                    await tx.commit();
                    successCount++;
                } catch (error) {
                    if(!error.message.includes("UNIQUE constraint failed")) {
                        console.error(`Error procesando empleado ${primerNombre} ${primerApellido}:`, error.message);
                    }
                }
            }
            console.log(`Importación finalizada. Éxitos: ${successCount} de ${empleados.length}.`);
        });
};

runImport();
