import { UsuariosRRHHDao } from "../../dao/usuarios/usuariosrrhh.dao.js";
import { GenerarPassword } from "../generalservices/usergenerator.service.js";
import { EnviarMailServices } from "../email/enviaremail.service.js";
import bcrypt from "bcryptjs";

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
    },

    resetPassword: async (idUsuario) => {
        if (!idUsuario) throw new Error("ID de usuario no proporcionado");

        const datos = await UsuariosRRHHDao.obtenerDatosParaReset(idUsuario);
        if (!datos) throw new Error("Usuario no encontrado");
        if (!datos.correoInstitucional) {
            throw new Error("El usuario no tiene correo institucional registrado; no se puede notificar la nueva contraseña.");
        }

        // Contraseña temporal aleatoria (nunca un valor fijo/predecible) enviada solo por correo.
        const tempPass = GenerarPassword();
        const hashedPass = await bcrypt.hash(tempPass, 10);
        await UsuariosRRHHDao.resetPassword(idUsuario, hashedPass);

        await EnviarMailServices({
            correo: datos.correoInstitucional,
            user: datos.usuario,
            pass: tempPass,
            nombre: `${datos.primerNombre} ${datos.primerApellido}`
        });

        return { message: "Contraseña reseteada. Se envió una contraseña temporal al correo institucional del usuario." };
    }
};
