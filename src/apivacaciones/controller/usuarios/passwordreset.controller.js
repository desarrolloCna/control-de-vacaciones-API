import { requestPasswordResetService } from "../../services/usuarios/passwordreset.service.js";

export const requestPasswordResetController = async (req, res) => {
    try {
        // Acepta el campo 'identifier' (CUI o correo) o 'correo' por compatibilidad
        const identifier = req.body.identifier || req.body.correo;
        if (!identifier) {
            return res.status(400).json({ responseData: "Ingrese su CUI o correo institucional." });
        }

        const result = await requestPasswordResetService(identifier);
        res.status(200).json({ responseData: result.message });
    } catch (error) {
        const status = error?.codRes || 500;
        const message = error?.message || "Ocurrió un error al procesar la solicitud.";
        res.status(status).json({ responseData: message });
    }
};
