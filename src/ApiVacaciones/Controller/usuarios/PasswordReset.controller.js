import { requestPasswordResetService } from "../../Services/usuarios/PasswordReset.service.js";

export const requestPasswordResetController = async (req, res) => {
    try {
        const { identifier } = req.body;
        if (!identifier) {
            return res.status(400).json({ responseData: "El identificador (DPI o Usuario) es obligatorio." });
        }

        const result = await requestPasswordResetService(identifier);
        res.status(200).json({ responseData: result.message });
    } catch (error) {
        const status = error?.codRes || 500;
        const message = error?.message || "Ocurrió un error al procesar la solicitud.";
        res.status(status).json({ responseData: message });
    }
};
