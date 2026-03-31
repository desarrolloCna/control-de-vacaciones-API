import { Connection } from '../connection/conexionsqlite.dao.js';
import bcrypt from 'bcryptjs';

export const UsuariosRRHHDao = {
    // Listar empleados con su información de usuario (filtrando por rol RRHH o sin usuario)
    obtenerUsuariosRRHH: async () => {
        const query = `
            SELECT 
                e.idEmpleado,
                TRIM(ip.primerNombre || ' ' || ip.primerApellido || ' ' || COALESCE(ip.segundoApellido, '')) as nombreCompleto,
                e.puesto,
                e.unidad,
                u.idUsuario,
                u.usuario,
                u.idRol,
                r.rol as nombreRol,
                u.estado as estadoUsuario,
                u.permisosModulos
            FROM empleados e
            JOIN infoPersonalEmpleados ip ON e.idInfoPersonal = ip.idInfoPersonal
            LEFT JOIN usuarios u ON e.idEmpleado = u.idEmpleado AND u.idRol IN (1, 2, 3)
            LEFT JOIN rolesUsuarios r ON u.idRol = r.idRol
            ORDER BY u.idUsuario DESC, ip.primerNombre ASC
        `;
        const result = await Connection.execute(query);
        return result.rows;
    },

    // Crear un nuevo usuario RRHH
    crearUsuarioRRHH: async (idEmpleado, idRol, usuario, pass, permisos) => {
        // Hashear la contraseña antes de guardar
        const hashedPass = await bcrypt.hash(pass, 10);
        const query = `
            INSERT INTO usuarios (idEmpleado, idRol, usuario, pass, estadoUsuario, estado, requiereCambioPass, permisosModulos)
            VALUES (?, ?, ?, ?, 'A', 'A', 0, ?)
            ON CONFLICT(idEmpleado) DO UPDATE SET
                idRol = excluded.idRol,
                usuario = excluded.usuario,
                pass = excluded.pass,
                permisosModulos = excluded.permisosModulos
        `;
        const result = await Connection.execute(query, [idEmpleado, idRol, usuario, hashedPass, permisos]);
        return result;
    },

    // Eliminar acceso de usuario
    eliminarUsuarioRRHH: async (idUsuario) => {
        const query = `UPDATE usuarios SET idRol = 4, permisosModulos = '[]' WHERE idUsuario = ? AND idRol IN (1, 2, 3)`;
        const result = await Connection.execute(query, [idUsuario]);
        return result;
    },

    // Actualizar permisos de usuario existente
    actualizarUsuarioRRHH: async (idUsuario, idRol, permisos) => {
        const query = `UPDATE usuarios SET idRol = ?, permisosModulos = ? WHERE idUsuario = ?`;
        const result = await Connection.execute(query, [idRol, permisos, idUsuario]);
        return result;
    }
};
