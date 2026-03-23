import { Connection } from "../ConexionB/ConexionCatSqlite.js";

export const getMunicipiosDao = async () => {
    try {
        const result = await Connection.execute("SELECT idMunicipio, municipio, estado FROM municipios;");
        return [result.rows];   
    } catch (error) {
        console.log("Error en getMunicipiosDao:", error);
        throw error;
    }
};