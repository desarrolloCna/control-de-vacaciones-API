import { UsuariosRRHHService } from "../../services/usuarios/usuariosrrhh.service.js";

export const UsuariosRRHHController = {
    obtenerUsuariosRRHH: async (req, res) => {
        try {
            const usuarios = await UsuariosRRHHService.obtenerUsuariosRRHH();
            res.json({ usuarios });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crearUsuarioRRHH: async (req, res) => {
        try {
            const { idEmpleado, idRol, usuario, pass, permisos } = req.body;
            const permisosDB = JSON.stringify(permisos || []);
            await UsuariosRRHHService.crearUsuarioRRHH(idEmpleado, idRol, usuario, pass, permisosDB);
            res.json({ message: "Acceso administrativo creado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminarUsuarioRRHH: async (req, res) => {
        try {
            await UsuariosRRHHService.eliminarUsuarioRRHH(req.params.id);
            res.json({ message: "Acceso eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizarUsuarioRRHH: async (req, res) => {
        try {
            const { idRol, permisos } = req.body;
            const permisosDB = JSON.stringify(permisos || []);
            await UsuariosRRHHService.actualizarUsuarioRRHH(req.params.id, idRol, permisosDB);
            res.json({ message: "Roles y permisos actualizados exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
