import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerDatosDashboardEjecutivoDao = async () => {
    try {
        // 1. Resumen Global
        const qResumen = `
            SELECT 
                COUNT(*) as totalSolicitudes,
                SUM(CASE WHEN estadoSolicitud IN ('autorizadas', 'finalizadas') THEN 1 ELSE 0 END) as totalAprobadas,
                SUM(cantidadDiasSolicitados) as totalDiasHistoricos
            FROM solicitudes_vacaciones
        `;
        const resResumen = await Connection.execute(qResumen);

        // 2. Tasa de Aprobación por Unidad (Heatmap approximation)
        const qUnidades = `
            SELECT 
                e.unidad,
                COUNT(sv.idSolicitud) as totalSolicitudes,
                SUM(CASE WHEN sv.estadoSolicitud IN ('autorizadas', 'finalizadas') THEN 1 ELSE 0 END) as aprobadas,
                SUM(sv.cantidadDiasSolicitados) as totalDias
            FROM empleados e
            LEFT JOIN solicitudes_vacaciones sv ON e.idEmpleado = sv.idEmpleado
            WHERE e.estado = 'A' AND e.unidad IS NOT NULL
            GROUP BY e.unidad
            ORDER BY totalSolicitudes DESC
        `;
        const resUnidades = await Connection.execute(qUnidades);

        // 3. Proyección de Retornos (Próximos 14 días)
        const qRetornos = `
            SELECT 
                sv.fechaRetornoLabores,
                COUNT(*) as cantidad
            FROM solicitudes_vacaciones sv
            WHERE sv.estadoSolicitud = 'finalizadas'
              AND sv.fechaRetornoLabores BETWEEN date('now') AND date('now', '+14 days')
            GROUP BY sv.fechaRetornoLabores
            ORDER BY sv.fechaRetornoLabores ASC
        `;
        const resRetornos = await Connection.execute(qRetornos);

        // 4. Status de Empleados en este instante
        const qStatusHoy = `
            SELECT 
                COUNT(*) as totalEmpleadosActivos,
                (SELECT COUNT(DISTINCT idEmpleado) 
                 FROM solicitudes_vacaciones 
                 WHERE estadoSolicitud = 'finalizadas' 
                   AND date('now') BETWEEN fechaInicioVacaciones AND fechaFinVacaciones
                ) as empleadosDeVacacionesDescansando
            FROM empleados WHERE estado = 'A'
        `;
        const resStatusHoy = await Connection.execute(qStatusHoy);

        // 5. Detalle de Empleados por Unidad (para el Explorador de Acordeones)
        const qDetalle = `
            SELECT 
                e.idEmpleado,
                (i.primerNombre || ' ' || i.primerApellido) as nombreCompleto,
                e.puesto,
                e.unidad,
                strftime('%d/%m/%Y', e.fechaIngreso) as fechaIngreso,
                COALESCE((SELECT SUM(diasDisponibles) FROM historial_vacaciones WHERE idEmpleado = e.idEmpleado AND tipoRegistro = 1), 0) as diasDisponibles
            FROM empleados e
            INNER JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            WHERE e.estado = 'A'
              AND e.idEmpleado NOT IN (SELECT idEmpleado FROM usuarios WHERE idRol IN (1, 3) AND idEmpleado IS NOT NULL)
            ORDER BY e.unidad ASC, nombreCompleto ASC
        `;
        const resDetalle = await Connection.execute(qDetalle);

        return {
            resumen: resResumen.rows[0],
            kpiUnidades: resUnidades.rows || [],
            proyeccionRetornos: resRetornos.rows || [],
            statusHoy: resStatusHoy.rows[0],
            detalleUnidades: resDetalle.rows || []
        };


    } catch (error) {
        console.error("Error en obtenerDatosDashboardEjecutivoDao:", error);
        throw error;
    }
};
