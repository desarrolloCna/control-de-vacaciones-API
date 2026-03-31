import { Connection } from "../connection/conexionsqlite.dao.js";
import bcrypt from "bcryptjs";

export const getLoginDataDao = async (data) => {
    try {
        // Buscamos el usuario SIN comparar la contraseña en la query
        // para poder hacer comparación híbrida (texto plano viejo vs bcrypt nuevo)
        const query = `SELECT dp.idDpi, 
                        ip.idInfoPersonal, 
                        em.idEmpleado, 
                        ip.primerNombre, 
                        ip.primerApellido, 
                        dp.numeroDocumento, 
                        us.usuario, 
                        us.pass,
                        us.idRol, 
                        em.unidad, 
                        em.puesto,
                        em.fechaIngreso,
                        ip.fechaNacimiento,
                        co.idCoordinador,
                        us.requiereCambioPass,
                        us.permisosModulos
                    FROM usuarios us
                    INNER JOIN empleados em ON us.idEmpleado = em.idEmpleado
                    INNER JOIN infoPersonalEmpleados ip ON em.idInfoPersonal = ip.idInfoPersonal
                    INNER JOIN dpiEmpleados dp ON ip.idDpi = dp.idDpi
                    LEFT JOIN coordinadores co ON em.idEmpleado = co.idEmpleado AND co.estado = 'A'
                    WHERE us.usuario = ? 
                    AND em.estado = 'A'
                    AND em.idEmpleado NOT IN (SELECT idEmpleado FROM suspensiones WHERE tipoSuspension = 'baja' AND estado = 'A')
                    AND NOT EXISTS (
                        SELECT 1 FROM suspensiones s 
                        WHERE s.idEmpleado = em.idEmpleado 
                        AND s.tipoSuspension = 'suspension'
                        AND date('now', 'localtime') BETWEEN date(s.fechaInicioSuspension) AND date(s.fechaFinSuspension)
                    );`;
        
        const result = await Connection.execute(query, [data.usuario]);
        
        if (result.rows.length === 0) {
            throw {
                codRes: 401,
                message: "Usuario o contraseña incorrecta" 
            };
        }

        const user = result.rows[0];
        const storedPass = user.pass;
        const inputPass = data.pass;

        // Comparación híbrida:
        // Si la contraseña guardada empieza con $2a$ o $2b$ es un hash bcrypt → usar bcrypt.compare
        // Si no, es una contraseña de texto plano (legacy) → comparar directamente
        let passwordValid = false;

        if (storedPass && (storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$'))) {
            // Contraseña hasheada con bcrypt
            passwordValid = await bcrypt.compare(inputPass, storedPass);
        } else {
            // Contraseña legacy en texto plano
            passwordValid = (inputPass === storedPass);
        }

        if (!passwordValid) {
            throw {
                codRes: 401,
                message: "Usuario o contraseña incorrecta"
            };
        }

        // Eliminar el campo pass del resultado antes de devolver
        const { pass, ...userData } = user;
        return userData;

    } catch (error) {
        console.log("Error en getLoginDataDao:", error);
        throw error;
    }
}
