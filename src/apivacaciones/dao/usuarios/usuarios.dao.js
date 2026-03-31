import { Connection } from "../connection/conexionsqlite.dao.js";
import bcrypt from "bcryptjs";

export const CrearUsuarioDao = async (data) => {
    try {
        const query = "INSERT INTO usuarios (idEmpleado, idRol, usuario, pass) VALUES (?, ?, ?, ?);";

        // Hashear la contraseña antes de guardar
        const hashedPass = await bcrypt.hash(data.pass, 10);

        const result = await Connection.execute(query, [
            data.idEmpleado,
            data.idRol,
            data.user,
            hashedPass
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
