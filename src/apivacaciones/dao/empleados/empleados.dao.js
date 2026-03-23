import { Connection } from "../connection/conexionsqlite.dao.js";

export const IngresarEmpleadoDao = async (data) => {
    try {
        const query = "INSERT INTO empleados (idInfoPersonal, puesto, salario, fechaIngreso, correoInstitucional, extensionTelefonica, unidad, renglon, observaciones, coordinacion, tipoContrato, numeroCuentaCHN, numeroContrato, numeroActa, numeroAcuerdo, isCoordinador, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'A');";

        const result = await Connection.execute(query, [
            data.idInfoPersonal,
            data.puesto,
            data.salario,
            data.fechaIngreso,
            data.correoInstitucional,
            data.extensionTelefonica,
            data.unidad,
            data.renglon,
            data.observaciones,
            data.coordinacion,
            data.tipoContrato,
            data.numeroCuentaCHN,
            data.numeroContrato,
            data.numeroActa,
            data.numeroAcuerdo,
            data.isCoordinador
        ]);

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarEmpleadoDao:", error);
        throw error;
    }
}

export const consultarEmpleadosUltimoAnioDao = async (idEmpleado) => {
    try {
        const query = `WITH params AS (SELECT ? AS idEmpleadoFiltro),
                       ultimo_balance_por_periodo AS (
                        SELECT 
                            idEmpleado,
                            periodo,
                            diasDisponibles
                        FROM historial_vacaciones hv1
                        WHERE idHistorial = (
                            SELECT MAX(idHistorial)
                            FROM historial_vacaciones hv2
                            WHERE hv2.idEmpleado = hv1.idEmpleado 
                            AND hv2.periodo = hv1.periodo
                            AND hv2.estado = 'A'
                        )
                    ),
                    empleados_filtrados AS (
                        SELECT 
                            u.idEmpleado,
                            ipe.idInfoPersonal,
                            ipe.primerNombre || ' ' || 
                            COALESCE(ipe.segundoNombre || ' ', '') ||
                            COALESCE(ipe.tercerNombre || ' ', '') ||
                            ipe.primerApellido || ' ' || 
                            COALESCE(ipe.segundoApellido, '') AS Nombre,
                            u.periodo,
                            u.diasDisponibles
                        FROM ultimo_balance_por_periodo u
                        INNER JOIN empleados e ON u.idEmpleado = e.idEmpleado
                        INNER JOIN infoPersonalEmpleados ipe ON e.idInfoPersonal = ipe.idInfoPersonal
                        CROSS JOIN params p
                        WHERE e.estado = 'A' AND (p.idEmpleadoFiltro = '' OR u.idEmpleado = p.idEmpleadoFiltro) AND e.idEmpleado NOT IN (SELECT idEmpleado FROM suspensiones WHERE tipoSuspension = 'baja' AND estado = 'A')
                    )
                    SELECT 
                        ef.idEmpleado,
                        ef.idInfoPersonal,
                        ef.Nombre
                    FROM empleados_filtrados ef
                    GROUP BY ef.idEmpleado, ef.Nombre
                    HAVING SUM(CASE WHEN ef.periodo < strftime('%Y', 'now') THEN ef.diasDisponibles ELSE 0 END) = 0
                    AND SUM(CASE WHEN ef.periodo = strftime('%Y', 'now') THEN ef.diasDisponibles ELSE 0 END) > 0;`;

        const result = await Connection.execute(query, [idEmpleado]);

        if (result.rows.length === 0) {

            const payload = {
                        idEmpleado: 0
            }

            return [payload];
        } else {
            return result.rows;
        }
    } catch (error) {
        console.log("Error en consultarEmpleadosUltimoAnioDao:", error);
        throw error;
    }
}

export const consultarEmpleadosSinVacacionesDao = async () => {
    try{
        const query = `WITH dias_periodo_anterior AS (
                SELECT 
                    idEmpleado,
                    COALESCE(SUM(diasDisponibles), 0) AS saldoViejo
                FROM historial_vacaciones 
                WHERE CAST(periodo AS INTEGER) < CAST(strftime('%Y','now') AS INTEGER)
                GROUP BY idEmpleado
            ),
            dias_actuales AS (
                SELECT 
                    idEmpleado,
                    COALESCE(SUM(diasDisponibles), 0) AS saldoActual
                FROM historial_vacaciones 
                WHERE CAST(periodo AS INTEGER) = CAST(strftime('%Y','now') AS INTEGER)
                GROUP BY idEmpleado
            )
            SELECT 
                e.idEmpleado, 
                e.fechaIngreso,
                ip.idInfoPersonal,
                ip.primerNombre || ' ' || 
                COALESCE(ip.segundoNombre || ' ', '') ||
                COALESCE(ip.tercerNombre || ' ', '') ||
                ip.primerApellido || ' ' || 
                COALESCE(ip.segundoApellido, '') AS Nombre,
                COALESCE(da.saldoActual, 0) AS diasTotales
            FROM empleados e 
            JOIN infopersonalEmpleados ip ON e.idInfoPersonal = ip.idInfoPersonal 
            LEFT JOIN dias_periodo_anterior dp ON dp.idEmpleado = e.idEmpleado
            JOIN dias_actuales da ON da.idEmpleado = e.idEmpleado
            WHERE e.estado = 'A' 
              AND e.idEmpleado NOT IN (SELECT idEmpleado FROM suspensiones WHERE tipoSuspension = 'baja' AND estado = 'A')
              AND (e.fechaIngreso > DATE('now', '-1 year') OR COALESCE(dp.saldoViejo, 0) <= 0)
              AND COALESCE(da.saldoActual, 0) > 0;`;

        const result = await Connection.execute(query);

        return result.rows;

    }catch(error){
        console.log("Error en consultarEmpleadosSinVacacionesDao:", error);
        throw error;
    }
}
