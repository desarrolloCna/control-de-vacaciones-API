import { generarExcelEmpleadosSaldosService, generarExcelSolicitudesMesService } from "../../services/reports/exportarexcel.service.js";
import dayjs from "dayjs";

export const descargarExcelSaldosController = async (req, res) => {
    try {
        const { unidad } = req.query;
        const buffer = await generarExcelEmpleadosSaldosService(unidad);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Saldos_Empleados_CNA_${dayjs().format('YYYYMMDD')}.xlsx`);
        res.status(200).send(buffer);
    } catch (error) {
        console.error("Error en descargarExcelSaldosController:", error);
        res.status(500).json({ error: "Error al generar el archivo Excel de saldos" });
    }
};

export const descargarExcelSolicitudesController = async (req, res) => {
    try {
        const { unidad } = req.query;
        const buffer = await generarExcelSolicitudesMesService(unidad);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Solicitudes_Mes_CNA_${dayjs().format('YYYYMMDD')}.xlsx`);
        res.status(200).send(buffer);
    } catch (error) {
        console.error("Error en descargarExcelSolicitudesController:", error);
        res.status(500).json({ error: "Error al generar el archivo Excel de solicitudes" });
    }
};
