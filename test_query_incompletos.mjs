import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function test() {
    try {
        const query = `
            SELECT 
                ip.idInfoPersonal,
                d.idDpi,
                d.numeroDocumento,
                ip.primerNombre,
                ip.segundoNombre,
                ip.primerApellido,
                ip.segundoApellido,
                ip.fechaIngreso
            FROM infoPersonalEmpleados ip
            JOIN dpiEmpleados d ON ip.idDpi = d.idDpi
            LEFT JOIN empleados e ON ip.idInfoPersonal = e.idInfoPersonal
            WHERE e.idInfoPersonal IS NULL
            AND ip.estado = 'A' AND d.estado = 'A';
        `;
        const result = await Connection.execute(query);
        console.log("RESULT", result.rows);
    } catch (e) {
        console.error("ERROR", e);
    }
}
test();
