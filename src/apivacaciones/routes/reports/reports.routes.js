import { Router } from "express";
import { vacaciosReportController } from "../../controller/reports/reporte-vacaciones.controller.js";

export const reportsRoute = Router();

reportsRoute.get('/vacacionesReport', vacaciosReportController);
