import { Connection } from "../connection/conexionsqlite.dao.js";

export const getLoginDataDao = async (data) => {
    try {
        const query = `SELECT dp.idDpi, 
                        ip.idInfoPersonal, 
                        em.idEmpleado, 
                        ip.primerNombre, 
                        ip.primerApellido, 
                        dp.numeroDocumento, 
                        us.usuario, 
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
                    AND us.pass = ?
                    AND em.estado = 'A'
                    AND em.idEmpleado NOT IN (SELECT idEmpleado FROM suspensiones WHERE tipoSuspension = 'baja' AND estado = 'A')
                    AND NOT EXISTS (
                        SELECT 1 FROM suspensiones s 
                        WHERE s.idEmpleado = em.idEmpleado 
                        AND s.tipoSuspension = 'suspension'
                        AND date('now', 'localtime') BETWEEN date(s.fechaInicioSuspension) AND date(s.fechaFinSuspension)
                    );`;
        
        const result = await Connection.execute(query, [data.usuario, data.pass]);
        
        if (result.rows.length === 0) {
            throw {
                codRes: 401,
                message: "Usuario o contraseña incorrecta" 
            };
        } else {
            return result.rows[0];
        }

    } catch (error) {
        console.log("Error en getLoginDataDao:", error);
        throw error;
    }
}
