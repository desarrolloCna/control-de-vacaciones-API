import { Router } from "express";
import { vacaciosReportController } from "../../controller/reports/reporte-vacaciones.controller.js";
import { obtenerDashboardRRHHController, obtenerDashboardEjecutivoController } from "../../controller/reports/dashboard.controller.js";
import { descargarPDFEjecutivoController } from "../../controller/reports/reportepdf.controller.js";
import { getAlertasAcumulacionController } from "../../controller/reports/alertas.controller.js";
import { getTimelineEmpleadoController } from "../../controller/reports/timeline.controller.js";
import { descargarExcelSaldosController, descargarExcelSolicitudesController } from "../../controller/reports/exportarexcel.controller.js";
import { authorizeRole } from "../../../middlewares/rolemiddleware.js";

export const reportsRoute = Router();

reportsRoute.get('/vacacionesReport', vacaciosReportController);
reportsRoute.get('/reportes/dashboard', authorizeRole(1, 3), obtenerDashboardRRHHController);
reportsRoute.get('/reportes/pdf-ejecutivo', authorizeRole(1, 3), descargarPDFEjecutivoController);
reportsRoute.get('/reportes/alertas-acumulacion', authorizeRole(1, 3), getAlertasAcumulacionController);
reportsRoute.get('/reportes/excel/saldos', authorizeRole(1, 3, 5), descargarExcelSaldosController);
reportsRoute.get('/reportes/excel/solicitudes', authorizeRole(1, 3, 5), descargarExcelSolicitudesController);
reportsRoute.get('/reportes/timeline/:idEmpleado', authorizeRole(1, 2, 3, 4, 5), getTimelineEmpleadoController);
reportsRoute.get('/reportes/dashboard-ejecutivo', authorizeRole(1, 3, 5), obtenerDashboardEjecutivoController);
