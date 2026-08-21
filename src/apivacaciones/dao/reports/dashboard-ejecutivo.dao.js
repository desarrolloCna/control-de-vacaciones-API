import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerDatosDashboardEjecutivoDao = async () => {
    try {
        // 1. Resumen Global
        const qResumen = `
            SELECT 
                COUNT(sv.idSolicitud) as totalSolicitudes,
                SUM(CASE WHEN sv.estadoSolicitud IN ('autorizadas', 'finalizadas') THEN 1 ELSE 0 END) as totalAprobadas,
                SUM(sv.cantidadDiasSolicitados) as totalDiasHistoricos
            FROM solicitudes_vacaciones sv
            INNER JOIN empleados e ON sv.idEmpleado = e.idEmpleado
            INNER JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            WHERE i.primerNombre NOT LIKE '%ADMINISTRADOR%'
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
            INNER JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            LEFT JOIN solicitudes_vacaciones sv ON e.idEmpleado = sv.idEmpleado
            WHERE e.estado = 'A' AND e.unidad IS NOT NULL AND i.primerNombre NOT LIKE '%ADMINISTRADOR%'
            GROUP BY e.unidad
            ORDER BY totalSolicitudes DESC
        `;
        const resUnidades = await Connection.execute(qUnidades);

        // 3. Proyección de Retornos (Próximos 14 días)
        const qRetornos = `
            SELECT 
                sv.fechaRetornoLabores,
                COUNT(sv.idSolicitud) as cantidad
            FROM solicitudes_vacaciones sv
            INNER JOIN empleados e ON sv.idEmpleado = e.idEmpleado
            INNER JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            WHERE sv.estadoSolicitud = 'finalizadas'
              AND sv.fechaRetornoLabores BETWEEN date('now') AND date('now', '+14 days')
              AND i.primerNombre NOT LIKE '%ADMINISTRADOR%'
            GROUP BY sv.fechaRetornoLabores
            ORDER BY sv.fechaRetornoLabores ASC
        `;
        const resRetornos = await Connection.execute(qRetornos);

        // 4. Status de Empleados en este instante
        const qStatusHoy = `
            SELECT 
                COUNT(*) as totalEmpleadosActivos,
                (SELECT COUNT(DISTINCT sv2.idEmpleado) 
                 FROM solicitudes_vacaciones sv2
                 INNER JOIN infoPersonalEmpleados i2 ON sv2.idInfoPersonal = i2.idInfoPersonal
                 WHERE sv2.estadoSolicitud = 'finalizadas' 
                   AND date('now') BETWEEN sv2.fechaInicioVacaciones AND sv2.fechaFinVacaciones
                   AND i2.primerNombre NOT LIKE '%ADMINISTRADOR%'
                ) as empleadosDeVacacionesDescansando
            FROM empleados e 
            INNER JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            WHERE e.estado = 'A' AND i.primerNombre NOT LIKE '%ADMINISTRADOR%'
        `;
        const resStatusHoy = await Connection.execute(qStatusHoy);

        // 5. Detalle de Empleados por Unidad (para el Explorador de Acordeones)
        const qDetalle = `
            SELECT 
                e.idEmpleado,
                TRIM(
                    i.primerNombre || ' ' || 
                    COALESCE(i.segundoNombre || ' ', '') || 
                    COALESCE(i.tercerNombre || ' ', '') || 
                    i.primerApellido || ' ' || 
                    COALESCE(i.segundoApellido, '')
                ) as nombreCompleto,
                e.puesto,
                e.unidad,
                strftime('%d/%m/%Y', e.fechaIngreso) as fechaIngreso,
                COALESCE((
                    SELECT 
                        SUM(CASE WHEN tipoRegistro = 1 THEN diasDisponibles ELSE 0 END) - 
                        SUM(CASE WHEN tipoRegistro = 2 THEN diasDebitados ELSE 0 END)
                    FROM historial_vacaciones 
                    WHERE idEmpleado = e.idEmpleado
                ), 0) as diasDisponibles,
                CASE WHEN c.idCoordinador IS NOT NULL THEN 1 ELSE 0 END as esAprobador
            FROM empleados e
            INNER JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            LEFT JOIN coordinadores c ON e.idEmpleado = c.idEmpleado
            WHERE e.estado = 'A' AND i.primerNombre NOT LIKE '%ADMINISTRADOR%'
            ORDER BY e.unidad ASC, esAprobador DESC, e.puesto ASC, nombreCompleto ASC
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
