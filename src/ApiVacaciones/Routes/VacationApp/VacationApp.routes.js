import { Router } from "express";
import { consultarSolicitudesPorEmpleadoController, getSolicitudesByIdController } from "../../controller/vacationapp/getsolicitudesbyid.controller.js";
import { actualizarEstadoSolicitudConroller, IngresarSolicitudController } from "../../controller/vacationapp/modificarsolicitud.controller.js";
import { consultarDiasSolicitadosPorAnioController, getSolicitudesController } from "../../controller/vacationapp/getsolicitudes.controller.js";
import { actualizarSaldoManualController, acreditarDiasPorPeriodoController, debitarDiasPorPeriodoController } from "../../controller/vacationapp/hisotoriavacaciones/controldedias.controller.js";
import {  consultarDiasDebitadosPorAnioController, consultarDiasDisponiblesController, obtenerHistorialPorEmpleadoController } from "../../controller/vacationapp/hisotoriavacaciones/consultashistorial.controller.js";
import { descargarPDFController } from "../../controller/vacationapp/descargarpdf.controller.js";

export const VacationAppRoute = Router();


VacationAppRoute.get('/solicitudesById', getSolicitudesByIdController);
VacationAppRoute.post('/ingresarSolicitudVacaciones', IngresarSolicitudController);
VacationAppRoute.get('/solicitudes', getSolicitudesController);
VacationAppRoute.put('/UpdateEstadoSolicitud', actualizarEstadoSolicitudConroller);
VacationAppRoute.put('/UpdateSaldoManual', actualizarSaldoManualController);
VacationAppRoute.post('/acreditarDias', acreditarDiasPorPeriodoController);
VacationAppRoute.get('/getHistorial', obtenerHistorialPorEmpleadoController);
VacationAppRoute.post('/debitarDias', debitarDiasPorPeriodoController);
VacationAppRoute.get('/consultarDiasSolicitadosPorAnio', consultarDiasSolicitadosPorAnioController);
VacationAppRoute.get('/consultarDiasDebitadosPorAnio', consultarDiasDebitadosPorAnioController);
VacationAppRoute.get('/consultarDiasDisponibles', consultarDiasDisponiblesController);
VacationAppRoute.get('/consultarSolicitudesPorEmpleado', consultarSolicitudesPorEmpleadoController);
VacationAppRoute.get('/descargarInformePDF/:idSolicitud/:idEmpleado', descargarPDFController);
