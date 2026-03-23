import { Connection } from "../conexionb/conexioncatsqlite.js";

export const getGeneroDao = async () => {
    try {
        const result = await Connection.execute("SELECT idGenero, genero, estado FROM genero;");
        return [result.rows]; 
    } catch (error) {
        console.log("Error en getGeneroDao:", error);
        throw error;
    }
};
