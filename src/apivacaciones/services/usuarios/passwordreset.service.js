import { findUserByCuiOrEmailDao, updateTemporaryPasswordDao } from "../../dao/usuarios/passwordreset.dao.js";
import { GenerarPassword } from "../generalservices/usergenerator.service.js";
import { EnviarMailServices } from "../email/enviaremail.service.js";

export const requestPasswordResetService = async (identifier) => {
    try {
        // 1. Buscar usuario por CUI o correo institucional
        const user = await findUserByCuiOrEmailDao(identifier);
        if (!user) {
            throw {
                codRes: 404,
                message: "No se encontró ningún usuario con ese CUI o correo institucional."
            };
        }

        if (!user.correoInstitucional) {
            throw {
                codRes: 400,
                message: "El usuario no tiene un correo institucional registrado. Contacte a Recursos Humanos."
            };
        }

        // 2. Generar password temporal
        const tempPass = GenerarPassword();

        // 3. Actualizar en BD y marcar para cambio obligatorio
        await updateTemporaryPasswordDao(user.idUsuario, tempPass);

        // 4. Enviar Correo
        const emailData = {
            correo: user.correoInstitucional,
            user: user.usuario,
            pass: tempPass,
            nombre: `${user.primerNombre} ${user.primerApellido}`
        };

        await EnviarMailServices(emailData);

        return { message: "Se ha enviado una contraseña temporal a su correo institucional." };
    } catch (error) {
        console.error("Error en requestPasswordResetService:", error);
        throw error;
    }
};
