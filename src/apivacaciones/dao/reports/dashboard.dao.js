import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerDatosDashboardDao = async () => {
    try {
        // 1. Distribución de estados
        const estadosRes = await Connection.execute(`
            SELECT estadoSolicitud, COUNT(*) as cantidad
            FROM solicitudes_vacaciones
            GROUP BY estadoSolicitud
        `);
        const estadosData = estadosRes.rows;

        let distribucionEstados = {};
        let totalSolicitudes = 0;
        let totalAutorizadas = 0;

        estadosData.forEach(row => {
            const estado = (row.estadoSolicitud || 'desconocido').toLowerCase();
            distribucionEstados[estado] = (distribucionEstados[estado] || 0) + row.cantidad;
            totalSolicitudes += row.cantidad;
            if (estado === 'autorizadas' || estado === 'finalizadas') {
                totalAutorizadas += row.cantidad;
            }
        });

        const tasaAprobacion = totalSolicitudes > 0 
            ? Math.round((totalAutorizadas / totalSolicitudes) * 100) 
            : 0;

        // 2. Promedio de días solicitados
        const promedioRes = await Connection.execute(`
            SELECT COALESCE(AVG(cantidadDiasSolicitados), 0) as promedio
            FROM solicitudes_vacaciones
        `);
        const promedioDias = Math.round(Number(promedioRes.rows[0].promedio) * 10) / 10;

        // 3. Total empleados activos
        const empRes = await Connection.execute(`
            SELECT COUNT(*) as total FROM empleados WHERE estado = 'A'
        `);
        const totalEmpleados = empRes.rows[0]?.total || 0;

        // 4. Solicitudes recientes (últimas 8)
        const recientesRes = await Connection.execute(`
            SELECT sv.idSolicitud, sv.correlativo, sv.estadoSolicitud, sv.cantidadDiasSolicitados,
                   sv.fechaSolicitud, sv.fechaInicioVacaciones, sv.fechaFinVacaciones,
                   (inf.primerNombre || ' ' || IFNULL(inf.segundoNombre, '') || ' ' || inf.primerApellido) AS nombreEmpleado
            FROM solicitudes_vacaciones sv
            JOIN empleados emp ON sv.idEmpleado = emp.idEmpleado
            JOIN infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            ORDER BY sv.idSolicitud DESC
            LIMIT 8
        `);

        // 5. Solicitudes este mes
        const mesActualRes = await Connection.execute(`
            SELECT COUNT(*) as total FROM solicitudes_vacaciones
            WHERE strftime('%Y-%m', fechaSolicitud) = strftime('%Y-%m', 'now')
        `);
        const solicitudesMesActual = mesActualRes.rows[0]?.total || 0;

        // 6. Cumplimiento Institucional (Empleados con al menos 1 vacación autorizada en el año actual)
        const cumplimientoRes = await Connection.execute(`
            SELECT COUNT(DISTINCT sv.idEmpleado) as empleadosConVacaciones
            FROM solicitudes_vacaciones sv
            WHERE strftime('%Y', sv.fechaInicioVacaciones) = strftime('%Y', 'now') 
              AND sv.estadoSolicitud IN ('finalizadas', 'autorizadas')
        `);
        const empleadosConVacaciones = cumplimientoRes.rows[0]?.empleadosConVacaciones || 0;

        return {
            distribucionEstados,
            kpis: {
                totalGlobal: totalSolicitudes,
                totalMes: solicitudesMesActual,
                tasaAprobacion,
                promedioDias,
                totalEmpleados,
                empleadosConVacaciones
            },
            solicitudesRecientes: recientesRes.rows
        };

    } catch (error) {
        console.error("Error en obtenerDatosDashboardDao:", error);
        throw error;
    }
};
