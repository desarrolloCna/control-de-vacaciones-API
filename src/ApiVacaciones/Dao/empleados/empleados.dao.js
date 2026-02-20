import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const IngresarEmpleadoDao = async (data) => {
    try {
        const query = "INSERT INTO empleados (idInfoPersonal, puesto, salario, fechaIngreso, correoInstitucional, extensionTelefonica, unidad, renglon, observaciones, coordinacion, tipoContrato, numeroCuentaCHN, numeroContrato, numeroActa, numeroAcuerdo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

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
            data.numeroAcuerdo
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
                        WHERE (p.idEmpleadoFiltro = '' OR u.idEmpleado = p.idEmpleadoFiltro)
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
        const query = `WITH dias_periodos AS (
                        SELECT 
                            idEmpleado,
                            COALESCE(SUM(diasAcreditados), 0) - COALESCE(SUM(diasDebitados), 0) AS saldoDias
                        FROM historial_vacaciones 
                        WHERE CAST(periodo AS INTEGER) < CAST(strftime('%Y','now') AS INTEGER)
                        GROUP BY idEmpleado
                    ),
                    dias_actuales AS (
                        SELECT 
                            idEmpleado,
                            COALESCE(SUM(diasAcreditados), 0) - COALESCE(SUM(diasDebitados), 0) AS saldoDias
                        FROM historial_vacaciones 
                        WHERE CAST(periodo AS INTEGER) = CAST(strftime('%Y','now') AS INTEGER)
                        GROUP BY idEmpleado
                    )
                    SELECT 
                        e.idEmpleado, 
                        ip.idInfoPersonal,
                        CONCAT(ip.primerNombre, ' ', ip.segundoNombre, ' ', ip.primerApellido, ' ', ip.segundoApellido) AS Nombre
                    FROM empleados e 
                    JOIN infopersonalEmpleados ip ON e.idInfoPersonal = ip.idInfoPersonal 
                    JOIN dias_periodos dp ON dp.idEmpleado = e.idEmpleado
                    LEFT JOIN dias_actuales da ON da.idEmpleado = e.idEmpleado
                    WHERE e.fechaIngreso <= DATE('now', '-1 year')
                    GROUP BY e.idEmpleado, e.fechaIngreso, ip.primerNombre, ip.segundoNombre, ip.primerApellido, ip.segundoApellido
                    HAVING dp.saldoDias = 0

                    UNION ALL

                    SELECT 
                        e.idEmpleado, 
                        ip.idInfoPersonal,
                        CONCAT(ip.primerNombre, ' ', ip.segundoNombre, ' ', ip.primerApellido, ' ', ip.segundoApellido) AS Nombre
                    FROM empleados e 
                    JOIN infopersonalEmpleados ip ON e.idInfoPersonal = ip.idInfoPersonal 
                    JOIN historial_vacaciones h ON e.idEmpleado = h.idEmpleado 
                    WHERE e.fechaIngreso BETWEEN DATE('now', '-1 year') AND DATE('now')
                    GROUP BY e.idEmpleado, e.fechaIngreso, ip.primerNombre, ip.segundoNombre, ip.primerApellido, ip.segundoApellido
                    HAVING COALESCE(SUM(h.diasAcreditados), 0) - COALESCE(SUM(h.diasDebitados), 0) > 0;`;

        const result = await Connection.execute(query);

        return result.rows;

    }catch(error){
        console.log("Error en consultarEmpleadosSinVacacionesDao:", error);
        throw error;
    }
}