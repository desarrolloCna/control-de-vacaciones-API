import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getDiscapacidadesDao = async () => {
    try {
        const result = await Connection.execute("SELECT idDiscapacidad, tipoDiscapacidad, estado FROM discapacidades;");
        return result.rows; 
    } catch (error) {
        console.log("Error en getDiscapacidadesDao:", error);
        throw error;
    }
};