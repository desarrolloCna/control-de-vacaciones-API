import { getAlertasAcumulacionService } from "../../services/reportes/alertas.service.js";

export const getAlertasAcumulacionController = async (req, res) => {
    try {
        const result = await getAlertasAcumulacionService();
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en getAlertasAcumulacionController:", error);
        return res.status(500).json({ message: "Error interno al obtener las alertas de acumulación." });
    }
};
