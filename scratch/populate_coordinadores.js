import { createClient } from "@libsql/client";
import "dotenv/config";

const db = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function main() {
    try {
        console.log("Limpiando tabla coordinadores...");
        await db.execute(`DELETE FROM coordinadores;`);

        const query = `
            SELECT e.idEmpleado, e.puesto, e.unidad, e.correoInstitucional, 
                   i.primerNombre, i.segundoNombre, i.primerApellido, i.segundoApellido
            FROM empleados e
            JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            WHERE (
                e.puesto LIKE '%Director%' OR 
                e.puesto LIKE '%Coordinador%' OR 
                e.puesto LIKE '%Jefe Unidad de Tecnologías%'
            )
            AND e.puesto NOT LIKE '%Jefe de Contabilidad%'
            AND e.puesto NOT LIKE '%Jefe de Presupuesto%'
            AND e.puesto NOT LIKE '%Jefe de Tesorería%'
        `;

        const res = await db.execute(query);
        const coordinadoresToInsert = res.rows;
        
        console.log(`Encontrados ${coordinadoresToInsert.length} coordinadores que aplican.`);

        for (const emp of coordinadoresToInsert) {
            const nombreCompleto = `${emp.primerNombre} ${emp.segundoNombre || ""} ${emp.primerApellido} ${emp.segundoApellido || ""}`.replace(/\s+/g, " ").trim();
            
            await db.execute({
                sql: `
                    INSERT INTO coordinadores (idEmpleado, nombreCoordinador, coordinadorUnidad, correoCoordinador, estado)
                    VALUES (?, ?, ?, ?, 'A')
                `,
                args: [emp.idEmpleado, nombreCompleto, emp.unidad, emp.correoInstitucional]
            });
            console.log(`Registrado coordinador: ${nombreCompleto} - ${emp.puesto}`);
        }
        
        console.log("Proceso terminado exitosamente.");
    } catch (e) {
        console.error(e);
    }
}
main();
