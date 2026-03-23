import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const findUserByDpiOrUsernameDao = async (identifier) => {
    try {
        const query = `
            SELECT us.idUsuario, us.usuario, em.idEmpleado, em.correoInstitucional, ip.primerNombre, ip.primerApellido
            FROM usuarios us
            INNER JOIN empleados em ON us.idEmpleado = em.idEmpleado
            INNER JOIN infoPersonalEmpleados ip ON em.idInfoPersonal = ip.idInfoPersonal
            INNER JOIN dpiEmpleados dp ON ip.idDpi = dp.idDpi
            WHERE us.usuario = ? OR dp.numeroDocumento = ?
            LIMIT 1;
        `;
        const result = await Connection.execute(query, [identifier, identifier]);
        return result.rows[0];
    } catch (error) {
        console.log("Error en findUserByDpiOrUsernameDao:", error);
        throw error;
    }
};

export const updateTemporaryPasswordDao = async (idUsuario, tempPass) => {
    try {
        const query = `
            UPDATE usuarios 
            SET pass = ?, requiereCambioPass = 1 
            WHERE idUsuario = ?;
        `;
        await Connection.execute(query, [tempPass, idUsuario]);
        return true;
    } catch (error) {
        console.log("Error en updateTemporaryPasswordDao:", error);
        throw error;
    }
};
