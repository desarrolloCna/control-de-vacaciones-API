import { Connection } from "../connection/conexionsqlite.dao.js";

export const getKioscoDatosDao = async () => {
    try {
        // 1. Vacaciones Activas (Hoy)
        const queryActivas = `
            SELECT 
                sv.idSolicitud,
                (inf.primerNombre || ' ' || IFNULL(inf.segundoNombre, '') || ' ' || inf.primerApellido) AS nombreCompleto,
                emp.unidad,
                sv.fechaFinVacaciones
            FROM 
                solicitudes_vacaciones sv
            JOIN 
                empleados emp ON sv.idEmpleado = emp.idEmpleado
            JOIN 
                infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            WHERE 
                sv.estadoSolicitud = 'finalizadas'
                AND date('now') BETWEEN sv.fechaInicioVacaciones AND sv.fechaFinVacaciones
            ORDER BY 
                sv.fechaFinVacaciones ASC;
        `;
        const resActivas = await Connection.execute(queryActivas);

        // 2. Próximos a retornar (En los próximos 5 días)
        const queryRetornos = `
            SELECT 
                (inf.primerNombre || ' ' || inf.primerApellido) AS nombreCompleto,
                emp.unidad,
                sv.fechaRetornoLabores
            FROM 
                solicitudes_vacaciones sv
            JOIN 
                empleados emp ON sv.idEmpleado = emp.idEmpleado
            JOIN 
                infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            WHERE 
                sv.estadoSolicitud = 'finalizadas'
                AND sv.fechaRetornoLabores BETWEEN date('now') AND date('now', '+5 days')
            ORDER BY 
                sv.fechaRetornoLabores ASC;
        `;
        const resRetornos = await Connection.execute(queryRetornos);

        // 3. Cumpleaños del Mes
        const queryCumples = `
            SELECT 
                (inf.primerNombre || ' ' || inf.primerApellido) AS nombreCompleto,
                emp.unidad,
                inf.fechaNacimiento
            FROM 
                empleados emp
            JOIN 
                infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            WHERE 
                emp.estado = 'A'
                AND strftime('%m', inf.fechaNacimiento) = strftime('%m', 'now')
            ORDER BY 
                strftime('%d', inf.fechaNacimiento) ASC;
        `;
        const resCumples = await Connection.execute(queryCumples);

        return {
            vacacionesActivas: resActivas.rows || [],
            proximosRetornos: resRetornos.rows || [],
            cumpleanosMes: resCumples.rows || []
        };
    } catch (error) {
        console.error("Error en getKioscoDatosDao:", error);
        throw error;
    }
};
