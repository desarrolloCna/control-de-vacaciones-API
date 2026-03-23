import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const getDatosContactoEmpleadoDao = async (idInfoPersonal) => {
    try {
        const query = "SELECT numeroCelular, correoPersonal FROM infoPersonalEmpleados WHERE idInfoPersonal = ?;"
        
        const result = await Connection.execute(query, [idInfoPersonal]);
        
        if (result.rows.length === 0) {
            throw {
                codRes: 409,
                message: "NUMERO DOCUMENTO INGRESADO YA EXISTE" 
            };
        } else {
            return result.rows[0];
        }
    } catch (error) {
        console.log("Error en getDatosContactoEmpleadoDao:", error);
        throw error;
    }
};