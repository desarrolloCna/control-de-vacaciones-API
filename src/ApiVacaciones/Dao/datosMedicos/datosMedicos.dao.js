import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const IngresarDatosMedicosDao = async (data) => {
    try {
        const query = "INSERT INTO datosMedicos (idInfoPersonal, discapacidad, tipoDiscapacidad, tipoSangre, condicionMedica, tomaMedicina, nombreMedicamento, sufreAlergia) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

        const result = await Connection.execute(query, [
            data.idInfoPersonal,
            data.discapacidad,
            data.tipoDiscapacidad,
            data.tipoSangre,
            data.condicionMedica,
            data.tomaMedicina,
            data.nombreMedicamento,
            data.sufreAlergia
        ]);

        // En SQLite usamos lastInsertRowid en lugar de insertId
        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarDatosMedicosDao:", error);
        throw error;
    }
}