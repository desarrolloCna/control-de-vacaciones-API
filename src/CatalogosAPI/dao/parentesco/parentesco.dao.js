import { Connection } from "../../../ApiVacaciones/Dao/Connection/ConexionSqlite.dao.js";

export const getParentescoDao = async () => {
    try {
        const result = await Connection.execute("SELECT idParentesco, parentesco, estado FROM parentescos;");
        return result.rows;
    } catch (error) {
        console.log("Error en getParentescoDao:", error);
        throw error;
    }
};