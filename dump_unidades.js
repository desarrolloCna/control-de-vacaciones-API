import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const dump = async () => {
    const res = await Connection.execute(`
        SELECT em.unidad, inf.primerNombre || ' ' || inf.primerApellido as nombre 
        FROM empleados em 
        JOIN infoPersonalEmpleados inf ON em.idInfoPersonal = inf.idInfoPersonal 
        ORDER BY em.unidad, nombre;
    `);
    
    const map = {};
    for(const d of res.rows) {
        if(!map[d.unidad]) map[d.unidad] = [];
        map[d.unidad].push(d.nombre);
    }
    
    fs.writeFileSync('C:/Users/jcurruchiche/.gemini/antigravity-ide/brain/6c34ef5a-a355-4965-8a6c-6ad429c5acd5/unidades_reporte.md', '# Reporte de Unidades y Empleados\n\n');
    for(const [unidad, empleados] of Object.entries(map)) {
        fs.appendFileSync('C:/Users/jcurruchiche/.gemini/antigravity-ide/brain/6c34ef5a-a355-4965-8a6c-6ad429c5acd5/unidades_reporte.md', `### ${unidad} (${empleados.length})\n`);
        for(const emp of empleados) {
            fs.appendFileSync('C:/Users/jcurruchiche/.gemini/antigravity-ide/brain/6c34ef5a-a355-4965-8a6c-6ad429c5acd5/unidades_reporte.md', `- ${emp}\n`);
        }
        fs.appendFileSync('C:/Users/jcurruchiche/.gemini/antigravity-ide/brain/6c34ef5a-a355-4965-8a6c-6ad429c5acd5/unidades_reporte.md', '\n');
    }
    console.log("Dumped");
};
dump();
