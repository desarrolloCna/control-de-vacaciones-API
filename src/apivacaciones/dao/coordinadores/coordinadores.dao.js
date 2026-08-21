import { Connection } from "../connection/conexionsqlite.dao.js";

export const registrarCoordinadorDao = async (data) => {
    try {
        const queryInsert = `
            INSERT INTO coordinadores (idEmpleado, nombreCoordinador, 
            coordinadorUnidad, correoCoordinador)
            VALUES (?, ?, ?, ?);
        `;

        const result = await Connection.execute(queryInsert, [
            data.idEmpleado,
            data.nombreCoordinador,
            data.coordinadorUnidad,
            data.correoCoordinador,
        ]);

        // En SQLite usamos lastInsertRowid en lugar de insertId
        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en registrarCoordinadorDao:", error);
        throw error;
    }
}

export const consultarCoordinadorDao = async (idCoordinador) => {
    try {
        const query = `
                    select c.idCoordinador, c.idEMpleado, c.nombreCoordinador, 
                    c.coordinadorUnidad, p.puesto as puestoCoordinador, c.correoCoordinador 
                    from coordinadores c
                    join empleados p on c.idEmpleado = p.idEmpleado
                    where c.idCoordinador = ?
                    and c.estado = 'A';
        `;

        const result = await Connection.execute(query, [idCoordinador]);
        
        if (result.rows.length === 0) {
            return [];
        } else {
            return result.rows[0];
        }
    } catch (error) {
        console.log("Error en consultarCoordinadorDao:", error);
        throw error;
    }
}

export const consultarCoordinadoresListDao = async () => {
    try {
        const query = `
            SELECT c.idCoordinador, c.idEmpleado, c.nombreCoordinador, 
            c.coordinadorUnidad, c.correoCoordinador, e.puesto as puestoCoordinador
            FROM coordinadores c
            LEFT JOIN empleados e ON c.idEmpleado = e.idEmpleado
            WHERE c.estado = 'A';
        `;

        const result = await Connection.execute(query);
        
        if (result.rows.length === 0) {
            return [];
        } else {
            return result.rows;
        }
    } catch (error) {
        console.log("Error en consultarCoordinadoresListDao:", error);
        throw error;
    }
}

export const UpsertCoordinadorDao = async (data) => {
    try {
        // Verificar si ya existe
        const queryCheck = "SELECT idCoordinador FROM coordinadores WHERE idEmpleado = ?;";
        const resultCheck = await Connection.execute(queryCheck, [data.idEmpleado]);

        if (resultCheck.rows.length > 0) {
            // Actualizar existente y asegurar que esté activo
            const queryUpdate = `
                UPDATE coordinadores 
                SET nombreCoordinador = ?, coordinadorUnidad = ?, correoCoordinador = ?, estado = 'A'
                WHERE idEmpleado = ?;
            `;
            await Connection.execute(queryUpdate, [
                data.nombreCoordinador,
                data.coordinadorUnidad,
                data.correoCoordinador,
                data.idEmpleado
            ]);
            return resultCheck.rows[0].idCoordinador;
        } else {
            // Insertar nuevo
            const queryInsert = `
                INSERT INTO coordinadores (idEmpleado, nombreCoordinador, coordinadorUnidad, correoCoordinador, estado)
                VALUES (?, ?, ?, ?, 'A');
            `;
            const resultInsert = await Connection.execute(queryInsert, [
                data.idEmpleado,
                data.nombreCoordinador,
                data.coordinadorUnidad,
                data.correoCoordinador,
            ]);
            return Number(resultInsert.lastInsertRowid);
        }
    } catch (error) {
        console.log("Error en UpsertCoordinadorDao:", error);
        throw error;
    }
};

export const DesactivarCoordinadorDao = async (idEmpleado) => {
    try {
        const query = "UPDATE coordinadores SET estado = 'I' WHERE idEmpleado = ?;";
        await Connection.execute(query, [idEmpleado]);
    } catch (error) {
        console.log("Error en DesactivarCoordinadorDao:", error);
        throw error;
    }
};

export const RelevarCoordinadorDao = async (idEmpleadoSaliente, idEmpleadoEntrante) => {
    try {
        // 1. Obtener datos del saliente en la tabla coordinadores
        const qSaliente = "SELECT * FROM coordinadores WHERE idEmpleado = ? AND estado = 'A';";
        const resSaliente = await Connection.execute(qSaliente, [idEmpleadoSaliente]);
        
        if (resSaliente.rows.length === 0) {
            throw new Error("El empleado saliente no es un coordinador activo.");
        }
        
        const coordinadorSaliente = resSaliente.rows[0];
        
        // 2. Obtener información del entrante (para nombre y correo)
        const qInfoEntrante = `
            SELECT 
                e.idEmpleado,
                TRIM(i.primerNombre || ' ' || i.primerApellido || ' ' || COALESCE(i.segundoApellido, '')) as nombreCompleto,
                i.correoPersonal,
                e.unidad
            FROM empleados e
            JOIN infoPersonalEmpleados i ON e.idInfoPersonal = i.idInfoPersonal
            WHERE e.idEmpleado = ?;
        `;
        const resInfoEntrante = await Connection.execute(qInfoEntrante, [idEmpleadoEntrante]);
        if (resInfoEntrante.rows.length === 0) {
            throw new Error("Empleado entrante no encontrado.");
        }
        
        const infoEntrante = resInfoEntrante.rows[0];
        
        // 3. Desactivar Saliente
        await DesactivarCoordinadorDao(idEmpleadoSaliente);
        await Connection.execute("UPDATE empleados SET isCoordinador = 0 WHERE idEmpleado = ?", [idEmpleadoSaliente]);
        
        // 4. Activar Entrante (Upsert)
        const idCoordinadorNuevo = await UpsertCoordinadorDao({
            idEmpleado: idEmpleadoEntrante,
            nombreCoordinador: infoEntrante.nombreCompleto,
            coordinadorUnidad: coordinadorSaliente.coordinadorUnidad, // Hereda la unidad del saliente
            correoCoordinador: infoEntrante.correoPersonal
        });
        
        // 5. Establecer isCoordinador en empleados
        await Connection.execute("UPDATE empleados SET isCoordinador = 1 WHERE idEmpleado = ?", [idEmpleadoEntrante]);
        
        // 6. Migrar solicitudes enviadas al nuevo jefe
        await Connection.execute(
            "UPDATE solicitudes_vacaciones SET idCoordinador = ? WHERE idCoordinador = ? AND estadoSolicitud = 'enviadas'",
            [idCoordinadorNuevo, coordinadorSaliente.idCoordinador]
        );
        
        return { success: true, message: "Sucesión completada exitosamente." };
    } catch (error) {
        console.log("Error en RelevarCoordinadorDao:", error);
        throw error;
    }
};
