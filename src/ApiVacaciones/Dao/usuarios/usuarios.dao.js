import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const CrearUsuarioDao = async (data) => {
    try {
        const query = "INSERT INTO usuarios (idEmpleado, idRol, usuario, pass) VALUES (?, ?, ?, ?);";

        const result = await Connection.execute(query, [
            data.idEmpleado,
            data.idRol,
            data.user,
            data.pass
        ]);

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en CrearUsuarioDao:", error);
        throw error;
    }
};

export const consultarExistenciaUsuarioDao = async (nombreUsuario) => {
    try {
        const sql = 'SELECT usuario FROM usuarios WHERE usuario = ?;';

        const result = await Connection.execute(sql, [nombreUsuario]);
        
        if (result.rows.length === 0) {
            return null; // No existe el usuario
        }
        
        return result.rows[0]; 
    } catch (error) {
        console.log("Error en consultarExistenciaUsuarioDao:", error);
        throw error;
    }
};

export const ActualizarRolUsuarioDao = async (idEmpleado, idRol) => {
    try {
        const query = "UPDATE usuarios SET idRol = ? WHERE idEmpleado = ?;";
        const result = await Connection.execute(query, [idRol, Number(idEmpleado)]);
        return result;
    } catch (error) {
        console.log("Error en ActualizarRolUsuarioDao:", error);
        throw error;
    }
};