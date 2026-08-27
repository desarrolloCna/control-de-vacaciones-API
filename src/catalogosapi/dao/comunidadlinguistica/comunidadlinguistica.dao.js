import { Connection } from "../conexionb/conexioncatsqlite.js";

export const getComunidadLinguisticaDao = async () => {
    try {
        const result = await Connection.execute("SELECT idComunidadLinguistica, tipoComunidad, estado FROM comunidadesLinguisticas;");
        return [result.rows]; 
    } catch (error) {
        console.log("Error en getComunidadLinguisticaDao:", error);
        throw error;
    }
}
