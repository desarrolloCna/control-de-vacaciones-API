import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getPuestosDao = async () => {
    try {
        const result = await Connection.execute("SELECT idPuesto, puesto, estado FROM puestos;");
        return [result.rows]; // Mantiene formato [puestos]
    } catch (error) {
        console.log("Error en getPuestosDao:", error);
        throw error;
    }
};