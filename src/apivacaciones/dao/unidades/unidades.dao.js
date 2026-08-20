import { Connection } from "../connection/conexionsqlite.dao.js";

export const getJerarquiaUnidadesDao = async () => {
    try {
        const query = `SELECT unidad, reportaA FROM jerarquia_unidades`;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        console.error("Error en getJerarquiaUnidadesDao:", error);
        throw error;
    }
};
