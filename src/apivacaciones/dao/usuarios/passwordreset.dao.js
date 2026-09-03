import { Connection } from "../connection/conexionsqlite.dao.js";
import bcrypt from "bcryptjs";

export const findUserByCuiOrEmailDao = async (identifier) => {
    try {
        const query = `
            SELECT us.idUsuario, us.usuario, em.idEmpleado, em.correoInstitucional, ip.primerNombre, ip.primerApellido
            FROM usuarios us
            INNER JOIN empleados em ON us.idEmpleado = em.idEmpleado
            INNER JOIN infoPersonalEmpleados ip ON em.idInfoPersonal = ip.idInfoPersonal
            INNER JOIN dpiEmpleados dp ON ip.idDpi = dp.idDpi
            WHERE LOWER(em.correoInstitucional) = LOWER(?) OR dp.numeroDocumento = ?
            LIMIT 1;
        `;
        const result = await Connection.execute(query, [identifier, identifier]);
        return result.rows[0];
    } catch (error) {
        console.log("Error en findUserByCuiOrEmailDao:", error);
        throw error;
    }
};

export const updateTemporaryPasswordDao = async (idUsuario, tempPass) => {
    try {
        // Hashear la contraseña temporal antes de guardar
        const hashedPass = await bcrypt.hash(tempPass, 10);
        const query = `
            UPDATE usuarios 
            SET pass = ?, requiereCambioPass = 1 
            WHERE idUsuario = ?;
        `;
        await Connection.execute(query, [hashedPass, idUsuario]);
        return true;
    } catch (error) {
        console.log("Error en updateTemporaryPasswordDao:", error);
        throw error;
    }
};
