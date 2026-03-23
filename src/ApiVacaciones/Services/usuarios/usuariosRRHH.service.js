import { UsuariosRRHHDao } from "../../dao/usuarios/usuariosrrhh.dao.js";

export const UsuariosRRHHService = {
    obtenerUsuariosRRHH: async () => {
        return await UsuariosRRHHDao.obtenerUsuariosRRHH();
    },

    crearUsuarioRRHH: async (idEmpleado, idRol, usuario, pass, permisos) => {
        if (!idEmpleado || !idRol || !usuario || !pass) throw new Error("Datos incompletos para crear usuario");
        return await UsuariosRRHHDao.crearUsuarioRRHH(idEmpleado, idRol, usuario, pass, permisos);
    },

    eliminarUsuarioRRHH: async (idUsuario) => {
        if (!idUsuario) throw new Error("ID de usuario no proporcionado");
        return await UsuariosRRHHDao.eliminarUsuarioRRHH(idUsuario);
    },

    actualizarUsuarioRRHH: async (idUsuario, idRol, permisos) => {
        if (!idUsuario || !idRol) throw new Error("Datos incompletos para actualizar usuario");
        return await UsuariosRRHHDao.actualizarUsuarioRRHH(idUsuario, idRol, permisos);
    }
};
