import { Connection } from "../conexionb/conexioncatsqlite.js";

export const getUnidadesDao = async () => {
    try {
        const result = await Connection.execute("SELECT idUnidad, acronimo, nombreUnidad, estado FROM unidades;");
        return [result.rows]; // Mantiene formato [unidades]
    } catch (error) {
        console.log("Error en getUnidadesDao:", error);
        throw error;
    }
};
