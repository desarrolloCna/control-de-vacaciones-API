import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getNivelEducativoDao = async () => {
    try {
        const result = await Connection.execute("SELECT idNivelEducativo, nivelEducativo, estado FROM nivelEducativo;");
        return [result.rows]; // Mantiene formato [nivelesEducativo]
    } catch (error) {
        console.log("Error en getNivelEducativoDao:", error);
        throw error;
    }
};