import { Connection } from "../connection/conexionsqlite.dao.js";

export const ingresarSuspensionDao = async (data) => {
    try {
        const queryInsert = `
            INSERT INTO suspensiones (idEmpleado, CUI, nombreEmpleado,
            fechaInicioSuspension, fechaFinSuspension, descripcionSuspension, tipoSuspension)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const result = await Connection.execute(queryInsert, [
            data.idEmpleado,
            data.CUI,
            data.nombreEmpleado,
            data.fechaInicioSuspension,
            data.fechaFinSuspension || null,
            data.descripcionSuspension,
            data.tipoSuspension || 'suspension'
        ]);

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en ingresarSuspensionDao:", error);
        throw error;
    }
};

export const GetSuspensionesDao = async () => {
    try {
        const query = `
            SELECT idSuspension, idEmpleado, CUI, 
            nombreEmpleado, fechaInicioSuspension, fechaFinSuspension,
            descripcionSuspension, tipoSuspension FROM suspensiones
            WHERE estado = 'A'
            ORDER BY idSuspension DESC;
        `;

        const result = await Connection.execute(query);
        
        if (result.rows.length === 0) {
            return [];
        } else {
            return result.rows;
        }
    } catch (error) {
        console.log("Error en GetSuspensionesDao:", error);
        throw error;
    }
};

export const getSuspensionesByEmpleadoDao = async (idEmpleado) => {
    try {
        const query = `
            SELECT fechaInicioSuspension, fechaFinSuspension 
            FROM suspensiones
            WHERE idEmpleado = ? AND estado = 'A';
        `;
        const result = await Connection.execute(query, [idEmpleado]);
        return result.rows;
    } catch (error) {
        console.log("Error en getSuspensionesByEmpleadoDao:", error);
        throw error;
    }
};

// Dar de baja al empleado: desactiva usuario, empleado y coordinador, registrando en bitácora
export const darDeBajaEmpleadoDao = async (idEmpleado, extraData) => {
    try {
        // 1. Obtener datos actuales para la bitácora
        const empRes = await Connection.execute("SELECT * FROM empleados WHERE idEmpleado = ?", [idEmpleado]);
        if (empRes.rows.length === 0) return false;
        const datosAnteriores = empRes.rows[0];

        // 2. Desactivar en cascada
        // Desactivar usuario (bloquea login)
        await Connection.execute(
            `UPDATE usuarios SET estadoUsuario = 'I' WHERE idEmpleado = ?;`,
            [idEmpleado]
        );
        // Desactivar empleado
        await Connection.execute(
            `UPDATE empleados SET estado = 'I' WHERE idEmpleado = ?;`,
            [idEmpleado]
        );
        // Desactivar como coordinador (si aplica)
        await Connection.execute(
            `UPDATE coordinadores SET estado = 'I' WHERE idEmpleado = ?;`,
            [idEmpleado]
        );

        // 3. Registrar en Bitácora
        const { registrarBitacoraDao } = await import("../bitacora/bitacora.dao.js");
        await registrarBitacoraDao({
            idUsuario: extraData.idUsuario,
            usuario: extraData.usuario,
            accion: 'UPDATE',
            tabla: 'empleados',
            idRegistro: idEmpleado,
            datosAnteriores: datosAnteriores,
            datosNuevos: { ...datosAnteriores, estado: 'I' },
            descripcion: `BAJA/DESPIDO EXTRORDINARIO: Se desactivó al empleado ${datosAnteriores.idEmpleado} y sus accesos.`
        });

        return true;
    } catch (error) {
        console.log("Error en darDeBajaEmpleadoDao:", error);
        throw error;
    }
};
