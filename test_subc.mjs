import dotenv from 'dotenv';
dotenv.config();
import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function run() {
    try {
        const q = await Connection.execute(`
            SELECT idEmpleado, puesto 
            FROM empleados 
            WHERE puesto LIKE '%SUBCOORDINADOR%'
        `);
        console.log("Subcoordinadores totales:", q.rows);
    }catch(error){
        console.log("ERROR MESSAGE:", error.message);
    }
}
run();
