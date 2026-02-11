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
                            periodo, 
                            COALESCE(SUM(diasAcreditados), 0) - COALESCE(SUM(diasDebitados), 0) AS saldoDias
                        FROM historial_vacaciones 
                        GROUP BY idEmpleado, periodo
                    )
                    SELECT DISTINCT e.idEmpleado, e.idInfoPersonal,
                    concat(ip.primerNombre, ' ', ip.segundoNombre, ' ', ip.primerapEllido, ' ', ip.segundoApellido)Nombre
                    FROM empleados e
                    INNER JOIN dias_periodos pa ON e.idEmpleado = pa.idEmpleado 
                        AND CAST(pa.periodo AS INTEGER) = CAST(strftime('%Y','now') AS INTEGER) - 1
                        AND pa.saldoDias = 0
                    INNER JOIN dias_periodos pac ON e.idEmpleado = pac.idEmpleado 
                        AND CAST(pac.periodo AS INTEGER) = CAST(strftime('%Y','now') AS INTEGER)
                        AND pac.saldoDias > 0
                    INNER JOIN infoPersonalEmpleados ip on e.idInfoPersonal = ip.idInfoPersonal
                    WHERE e.fechaIngreso BETWEEN date('now', '-1 year') AND date('now');`;

        const result = await Connection.execute(query);

        return result.rows;

    }catch(error){
        console.log("Error en consultarEmpleadosSinVacacionesDao:", error);
        throw error;
    }
}