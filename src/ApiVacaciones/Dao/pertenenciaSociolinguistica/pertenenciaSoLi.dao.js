import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const IngresarPertenenciaSoLi = async (data) => {
    try {
        const query = "INSERT INTO pertenenciaSociolinguistica (idInfoPersonal, etnia, comunidadLinguistica) VALUES (?, ?, ?);";

        const result = await Connection.execute(query, [
            data.idInfoPersonal,
            data.etnia,
            data.comunidadLinguistica
        ]);

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarPertenenciaSoLi:", error);
        throw error;
    }
};