import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getRenglonesDao = async () => {
    try {
        const result = await Connection.execute("SELECT idRenglonPresupuestario, renglon, descripcion, estado FROM renglonesPresupuestarios;");
        return [result.rows]; // Mantiene formato [renglones]
    } catch (error) {
        console.log("Error en getRenglonesDao:", error);
        throw error;
    }
};