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
            throw {
                codRes: 409,
                message: "NO EXISTEN REGISTROS PARA EL COORDINADOR INGRESADO",
            };
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
            SELECT idCoordinador, idEmpleado, nombreCoordinador, 
            coordinadorUnidad, correoCoordinador FROM coordinadores
            WHERE estado = 'A';
        `;

        const result = await Connection.execute(query);
        
        if (result.rows.length === 0) {
            throw {
                codRes: 409,
                message: "NO EXISTEN REGISTROS PARA EL COORDINADOR INGRESADO",
            };
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
