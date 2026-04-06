import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js'; 
async function run() { 
    try {
        const result = await Connection.execute("SELECT * FROM puestos WHERE puesto LIKE '%Director%'"); 
        console.log(result.rows); 
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
} 
run();
