import { Connection } from "../connection/conexionsqlite.dao.js";

export const getDatosContactoEmpleadoDao = async (idInfoPersonal) => {
    try {
        const query = "SELECT numeroCelular, correoPersonal FROM infoPersonalEmpleados WHERE idInfoPersonal = ?;"
        
        const result = await Connection.execute(query, [idInfoPersonal]);
        
        if (result.rows.length === 0) {
            return null;
        } else {
            return result.rows[0];
        }
    } catch (error) {
        console.log("Error en getDatosContactoEmpleadoDao:", error);
        throw error;
    }
};
