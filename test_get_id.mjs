import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function test() {
    try {
        const result = await Connection.execute(`
            SELECT ip.idInfoPersonal 
            FROM infoPersonalEmpleados ip 
            LEFT JOIN empleados e ON ip.idInfoPersonal = e.idInfoPersonal 
            WHERE e.idInfoPersonal IS NULL LIMIT 1;
        `);
        console.log("ID:", result.rows);
    } catch (e) {
        console.error("ERROR", e);
    }
}
test();
