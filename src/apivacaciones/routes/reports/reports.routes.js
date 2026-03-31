import { Router } from "express";
import { vacaciosReportController } from "../../controller/reports/reporte-vacaciones.controller.js";
import { obtenerDashboardRRHHController } from "../../controller/reports/dashboard.controller.js";
import { authorizeRole } from "../../../middlewares/rolemiddleware.js";

export const reportsRoute = Router();

reportsRoute.get('/vacacionesReport', vacaciosReportController);
reportsRoute.get('/reportes/dashboard', authorizeRole(1, 3), obtenerDashboardRRHHController);
