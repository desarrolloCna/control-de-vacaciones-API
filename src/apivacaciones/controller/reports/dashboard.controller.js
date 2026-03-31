import { obtenerDatosDashboardDao } from "../../dao/reports/dashboard.dao.js";

export const obtenerDashboardRRHHController = async (req, res) => {
    try {
        const datos = await obtenerDatosDashboardDao();
        
        return res.status(200).json(datos);
        
    } catch (error) {
        console.error("Error en obtenerDashboardRRHHController:", error);
        return res.status(500).json({ message: "Error interno obteniendo dashboard RRHH." });
    }
};
