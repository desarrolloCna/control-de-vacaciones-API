import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getPuebloPertenecienteDao = async () => {
    try {
        const result = await Connection.execute("SELECT idPuebloPerteneciente, pueblo, estado FROM puebloPerteneciente;");
        return [result.rows]; // Mantiene formato [pueblosPerteneciente]
    } catch (error) {
        console.log("Error en getPuebloPertenecienteDao:", error);
        throw error;
    }
};