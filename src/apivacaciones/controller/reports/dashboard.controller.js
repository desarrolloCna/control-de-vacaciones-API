import { obtenerDatosDashboardDao } from "../../dao/reports/dashboard.dao.js";
import { obtenerDatosDashboardEjecutivoDao } from "../../dao/reports/dashboard-ejecutivo.dao.js";

export const obtenerDashboardRRHHController = async (req, res) => {
    try {
        const datos = await obtenerDatosDashboardDao();
        
        return res.status(200).json(datos);
        
    } catch (error) {
        console.error("Error en obtenerDashboardRRHHController:", error);
        return res.status(500).json({ message: "Error interno obteniendo dashboard RRHH." });
    }
};

export const obtenerDashboardEjecutivoController = async (req, res) => {
    try {
        const data = await obtenerDatosDashboardEjecutivoDao();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error en obtenerDashboardEjecutivoController:", error);
        res.status(500).json({ error: "Error interno procesando KPIs Ejecutivos" });
    }
};
