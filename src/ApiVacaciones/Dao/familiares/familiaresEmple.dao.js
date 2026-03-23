import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const IngresarFamiliarDao = async (data) => {
    try {
        const query = "INSERT INTO familiaresDeEmpleados (idInfoPersonal, nombreFamiliar, telefono, parentesco, fechaNacimiento) VALUES (?, ?, ?, ?, ?);";

        const result = await Connection.execute(query, [
            data.idInfoPersonal,
            data.nombreFamiliar,
            data.telefono,
            data.parentesco,
            data.fechaNacimiento,
        ]);

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarFamiliarDao:", error);
        throw error;
    }
};