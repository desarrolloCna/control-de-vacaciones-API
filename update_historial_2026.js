import { createClient } from "@libsql/client";
import "dotenv/config";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear.js";
dayjs.extend(isLeapYear);

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const run = async () => {
    try {
        console.log("Iniciando actualización del periodo 2026...");
        
        const result = await Connection.execute(`
            SELECT idEmpleado, idInfoPersonal, fechaIngreso 
            FROM empleados
            WHERE fechaIngreso IS NOT NULL AND fechaIngreso != ''
        `);
        const empleados = result.rows;
        
        const anioEnCurso = dayjs().year(); // 2026 based on system time
        const currentDay = dayjs();
        let actualizados = 0;

        const tx = await Connection.transaction("write");

        for (const emp of empleados) {
            if (!emp.fechaIngreso) continue;
            
            const startYear = parseInt(emp.fechaIngreso.substring(0, 4), 10);
            if (isNaN(startYear)) continue;

            let dias2026 = 20;

            if (startYear === anioEnCurso) {
                // Entered in 2026
                const fIngreso = dayjs(emp.fechaIngreso);
                const daysDiff = currentDay.diff(fIngreso, "day") + 1; // inclusive
                dias2026 = Math.min(20, Math.round((daysDiff * 20) / 365));
            } else {
                // Entered before 2026
                const startOfYear = dayjs(`${anioEnCurso}-01-01`);
                const daysDiff = currentDay.diff(startOfYear, "day") + 1;
                dias2026 = Math.min(20, Math.round((daysDiff * 20) / 365));
            }
            
            // Adjust to ensure it's not negative
            dias2026 = Math.max(0, dias2026);

            // Update only the 2026 record for this employee
            await tx.execute({
                sql: `UPDATE historial_vacaciones 
                      SET diasAcreditados = ?, diasDisponibles = ?
                      WHERE idEmpleado = ? AND periodo = ?`,
                args: [dias2026, dias2026, emp.idEmpleado, anioEnCurso]
            });
            actualizados++;
        }
        
        // Let's also recount sumatoriaDias for ALL periods of each employee to ensure data integrity
        for (const emp of empleados) {
             const periodsResult = await tx.execute({
                 sql: `SELECT idHistorial, diasAcreditados FROM historial_vacaciones WHERE idEmpleado = ? ORDER BY periodo ASC`,
                 args: [emp.idEmpleado]
             });
             let sum = 0;
             for (const row of periodsResult.rows) {
                 sum += row.diasAcreditados;
                 await tx.execute({
                     sql: `UPDATE historial_vacaciones SET sumatoriaDias = ? WHERE idHistorial = ?`,
                     args: [sum, row.idHistorial]
                 });
             }
        }

        await tx.commit();
        console.log(`Completado. Se actualizaron ${actualizados} periodos del año ${anioEnCurso}.`);
    } catch (e) {
        console.error("Error updating history:", e);
    }
};

run();
