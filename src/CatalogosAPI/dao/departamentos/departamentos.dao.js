import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getDepartamentosDao = async () => {
    try {
        const result = await Connection.execute("SELECT idDepartamento, departamento, estado FROM departamentos;");
        return [result.rows]; 
    } catch (error) {
        console.log("Error en getDepartamentosDao:", error);
        throw error;
    }
};