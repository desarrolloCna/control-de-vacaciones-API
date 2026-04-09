import { obtenerDatosDashboardDao } from "../../dao/reports/dashboard.dao.js";
import { generarPDFEjecutivoService } from "../../services/reports/reportepdf.service.js";

export const descargarPDFEjecutivoController = async (req, res) => {
    try {
        // Obtener la misma data que usa el dashboard
        const datosDashboard = await obtenerDatosDashboardDao();
        
        // Generar el Buffer del PDF
        const pdfBuffer = await generarPDFEjecutivoService(datosDashboard);
        
        // Retornar como archivo descargable
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte-ejecutivo-cna.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        
        return res.status(200).send(pdfBuffer);
        
    } catch (error) {
        console.error("Error en descargarPDFEjecutivoController:", error);
        return res.status(500).json({ message: "Error interno generando reporte PDF RRHH." });
    }
};
