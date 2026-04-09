import { Connection } from "../connection/conexionsqlite.dao.js";

export const getDatosEmpleadosSaldosDao = async (unidad = null) => {
    try {
        const params = [];
        let whereClause = 'WHERE emp.estado = \'A\'';
        if (unidad) {
            whereClause += ' AND emp.unidad = ?';
            params.push(unidad);
        }
        const query = `
            SELECT 
                emp.idEmpleado, 
                inf.DPI,
                (inf.primerNombre || ' ' || IFNULL(inf.segundoNombre, '') || ' ' || inf.primerApellido || ' ' || IFNULL(inf.segundoApellido, '')) AS nombreCompleto,
                emp.puesto,
                emp.renglon,
                emp.unidad,
                emp.fechaIngreso,
                emp.estado,
                COALESCE(
                    (SELECT SUM(diasAsignados) FROM historial_vacaciones WHERE idEmpleado = emp.idEmpleado AND tipoRegistro = 1), 
                0) - 
                COALESCE(
                    (SELECT SUM(diasSolicitados) FROM historial_vacaciones WHERE idEmpleado = emp.idEmpleado AND tipoRegistro = 2), 
                0) as saldoDisponible
            FROM 
                empleados emp
            JOIN 
                infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            ${whereClause}
            ORDER BY 
                emp.unidad ASC, nombreCompleto ASC;
        `;
        const result = await Connection.execute({ sql: query, args: params });
        return result.rows || [];
    } catch (error) {
        console.error("Error en getDatosEmpleadosSaldosDao:", error);
        throw error;
    }
};

export const getDatosSolicitudesMesDao = async (unidad = null) => {
    try {
        const params = [];
        let unidadClause = '';
        if (unidad) {
            unidadClause = ' AND emp.unidad = ?';
            params.push(unidad);
        }
        const query = `
            SELECT 
                sv.idSolicitud, 
                sv.correlativo, 
                (inf.primerNombre || ' ' || IFNULL(inf.segundoNombre, '') || ' ' || inf.primerApellido) AS nombreEmpleado,
                emp.unidad,
                sv.estadoSolicitud, 
                sv.cantidadDiasSolicitados,
                sv.fechaSolicitud, 
                sv.fechaInicioVacaciones, 
                sv.fechaFinVacaciones
            FROM 
                solicitudes_vacaciones sv
            JOIN 
                empleados emp ON sv.idEmpleado = emp.idEmpleado
            JOIN 
                infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            WHERE 
                strftime('%Y-%m', sv.fechaSolicitud) = strftime('%Y-%m', 'now')
                ${unidadClause}
            ORDER BY 
                sv.fechaSolicitud DESC;
        `;
        const result = await Connection.execute({ sql: query, args: params });
        return result.rows || [];
    } catch (error) {
        console.error("Error en getDatosSolicitudesMesDao:", error);
        throw error;
    }
};
