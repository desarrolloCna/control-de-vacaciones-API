import { getJerarquiaUnidadesDao } from "../../dao/unidades/unidades.dao.js";

export const getJerarquiaUnidadesService = async () => {
    try {
        return await getJerarquiaUnidadesDao();
    } catch (error) {
        throw new Error("Error en servicio de jerarquía de unidades: " + error.message);
    }
};
