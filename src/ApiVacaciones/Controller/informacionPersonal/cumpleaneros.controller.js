import { Connection } from "../../Dao/Connection/ConexionSqlite.dao.js";

// Obtiene los empleados cuyo mes de nacimiento coincide con el mes actual
export const getCumpleanerosDelMes = async (req, res) => {
    try {
        const result = await Connection.execute(`
            SELECT primerNombre, primerApellido, fechaNacimiento, fotografia
            FROM informacion_personal_empleado 
            WHERE strftime('%m', fechaNacimiento) = strftime('%m', 'now') 
            ORDER BY strftime('%d', fechaNacimiento) ASC
        `);

        // Devolver listado
        res.status(200).json({ data: result.rows });
    } catch (error) {
        res.status(500).json({ error: "Error consultando cumpleañeros del mes" });
    }
};
