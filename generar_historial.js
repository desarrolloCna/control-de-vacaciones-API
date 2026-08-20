import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const run = async () => {
    try {
        console.log("Iniciando generación de historial de vacaciones...");
        
        // 1. Delete existing history (optional, to avoid duplicates if re-run)
        await Connection.execute("DELETE FROM historial_vacaciones;");
        console.log("Historial anterior limpiado.");

        // 2. Get all employees
        const result = await Connection.execute(`
            SELECT idEmpleado, idInfoPersonal, fechaIngreso 
            FROM empleados
            WHERE fechaIngreso IS NOT NULL AND fechaIngreso != ''
        `);
        const empleados = result.rows;
        
        const currentYear = 2026; // System is apparently configured for 2026 based on previous context
        let insertados = 0;

        // 3. For each employee, generate a period for each year they have been in the company
        for (const emp of empleados) {
            if (!emp.fechaIngreso) continue;
            
            // Format is YYYY-MM-DD
            const startYear = parseInt(emp.fechaIngreso.substring(0, 4), 10);
            
            if (isNaN(startYear)) continue;

            const tx = await Connection.transaction("write");
            let sumatoria = 0;

            for (let anio = startYear; anio <= currentYear; anio++) {
                // Acreditamos 20 días por año (tipoRegistro = 1)
                sumatoria += 20;
                await tx.execute({
                    sql: `INSERT INTO historial_vacaciones 
                          (idEmpleado, idInfoPersonal, periodo, diasAcreditados, diasDebitados, diasDisponibles, sumatoriaDias, tipoRegistro) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
                    args: [
                        emp.idEmpleado,
                        emp.idInfoPersonal,
                        anio,
                        20, // diasAcreditados
                        0,  // diasDebitados (default 0, HR will adjust)
                        20, // diasDisponibles for this period
                        sumatoria // acumulado
                    ]
                });
                insertados++;
            }
            await tx.commit();
        }

        console.log(`Completado. Se insertaron ${insertados} periodos vacacionales en total para ${empleados.length} empleados.`);
    } catch (e) {
        console.error("Error generating history:", e);
    }
};

run();
