import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const IngresarNivelEducativoDao = async (data) => {
    console.log(data)
    try {
        const query = "INSERT INTO nivelEducativo (idInfoPersonal, nivelDeEstudios, ultimoNivelAlcanzado, añoUltimoNivelCursado, Profesion, numeroColegiado, fechaColegiacion) VALUES (?, ?, ?, ?, ?, ?, ?);";

        const result = await Connection.execute(query, [
            data.idInfoPersonal,
            data.nivelDeEstudios,
            data.ultimoNivelAlcanzado,
            data.anioUltimoNivelCursado,
            data.profesion,
            data.numeroColegiado,
            data.fechaColegiacionToSend
        ]);

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarNivelEducativoDao:", error);
        throw error;
    }
};