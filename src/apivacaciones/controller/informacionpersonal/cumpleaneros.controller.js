import { Connection } from "../../dao/connection/conexionsqlite.dao.js";

// Obtiene los empleados cuyo mes de nacimiento coincide con el mes actual
export const getCumpleanerosDelMes = async (req, res) => {
    try {
        const result = await Connection.execute(`
            SELECT primerNombre, primerApellido, fechaNacimiento
            FROM infoPersonalEmpleados 
            WHERE strftime('%m', fechaNacimiento) = strftime('%m', 'now')
            AND estado = 'A'
            ORDER BY strftime('%d', fechaNacimiento) ASC
        `);

        // Devolver listado
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error("DB_ERROR_CUMPLEANEROS:", error);
        res.status(500).json({ error: "Error consultando cumpleañeros del mes" });
    }
};
