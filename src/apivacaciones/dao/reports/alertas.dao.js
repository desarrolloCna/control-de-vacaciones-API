import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerEmpleadosSinVacacionesRecientes = async () => {
    try {
        const query = `
            SELECT 
                e.idEmpleado, 
                (empInfo.primerNombre || ' ' || IFNULL(empInfo.segundoNombre, '') || ' ' || empInfo.primerApellido || ' ' || IFNULL(empInfo.segundoApellido, '')) AS nombreEmpleado,
                e.unidad,
                MAX(sv.fechaFinVacaciones) AS ultimaVacacion
            FROM empleados e
            JOIN infoPersonalEmpleados empInfo ON e.idInfoPersonal = empInfo.idInfoPersonal
            LEFT JOIN solicitudes_vacaciones sv ON e.idEmpleado = sv.idEmpleado AND sv.estadoSolicitud IN ('finalizadas', 'autorizadas')
            WHERE e.estado = 'A'
              AND e.idRol != 1 
              AND e.puesto NOT LIKE '%ADMINISTRADOR%'
              AND (e.fechaIngreso IS NULL OR e.fechaIngreso <= date('now', '-12 months'))
            GROUP BY e.idEmpleado
            HAVING ultimaVacacion IS NULL OR ultimaVacacion < date('now', '-12 months')
            ORDER BY ultimaVacacion ASC
        `;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        console.error("Error en obtenerEmpleadosSinVacacionesRecientes:", error);
        throw error;
    }
};

export const obtenerEmpleadosConExcesoDias = async () => {
    try {
        const query = `
            SELECT 
                e.idEmpleado,
                (empInfo.primerNombre || ' ' || IFNULL(empInfo.segundoNombre, '') || ' ' || empInfo.primerApellido || ' ' || IFNULL(empInfo.segundoApellido, '')) AS nombreEmpleado,
                e.unidad,
                (
                  SUM(hv.diasDisponibles) - 
                  COALESCE((
                      SELECT SUM(cantidadDiasSolicitados) 
                      FROM solicitudes_vacaciones 
                      WHERE idEmpleado = e.idEmpleado 
                      AND estadoSolicitud IN ('enviada', 'autorizadas', 'reprogramacion')
                  ), 0)
                ) as diasAcumulados
            FROM empleados e
            JOIN infoPersonalEmpleados empInfo ON e.idInfoPersonal = empInfo.idInfoPersonal
            JOIN historial_vacaciones hv ON e.idEmpleado = hv.idEmpleado
            WHERE e.estado = 'A'
              AND e.idRol != 1
              AND e.puesto NOT LIKE '%ADMINISTRADOR%'
            GROUP BY e.idEmpleado
            HAVING diasAcumulados > 30
            ORDER BY diasAcumulados DESC
        `;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        console.error("Error en obtenerEmpleadosConExcesoDias:", error);
        throw error;
    }
};

export const obtenerTodosEmpleadosActivosDao = async () => {
    try {
        const query = `
            SELECT 
                e.idEmpleado, 
                e.idInfoPersonal,
                e.fechaIngreso,
                (empInfo.primerNombre || ' ' || IFNULL(empInfo.segundoNombre, '') || ' ' || empInfo.primerApellido || ' ' || IFNULL(empInfo.segundoApellido, '')) AS nombreEmpleado,
                e.unidad
            FROM empleados e
            JOIN infoPersonalEmpleados empInfo ON e.idInfoPersonal = empInfo.idInfoPersonal
            WHERE e.estado = 'A'
        `;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        console.error("Error en obtenerTodosEmpleadosActivosDao:", error);
        throw error;
    }
};

export const obtenerSuspensionesPorEmpleadoDao = async (idEmpleado) => {
    try {
        const result = await Connection.execute(
            "SELECT fechaInicioSuspension, fechaFinSuspension FROM suspensiones WHERE idEmpleado = ? AND estado = 'A'",
            [idEmpleado]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const obtenerHistorialSaldosPorEmpleadoDao = async (idEmpleado) => {
    try {
        const result = await Connection.execute(
            "SELECT periodo, diasDisponibles FROM historial_vacaciones WHERE idEmpleado = ?",
            [idEmpleado]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
};
