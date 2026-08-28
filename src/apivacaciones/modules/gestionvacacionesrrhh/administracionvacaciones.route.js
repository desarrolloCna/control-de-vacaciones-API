

import { Router } from "express";
import { cancelarSolicitudAutorizadaController, consultarSolicitudesVacacionesAutorizadasController, consultarSolicitudesReprogramadasController, cancelarSolicitudParcialController, consultarSolicitudesCanceladasController } from "./administracionvacaciones.controller.js";
import { authorizeRole } from "../../../middlewares/rolemiddleware.js";
import { auditMiddleware } from "../../../middlewares/auditmiddleware.js";

export const administracionvacacionesRoute = Router();

administracionvacacionesRoute.get('/consultarSolicitudesVacacionesAutorizadas', authorizeRole(1, 3), consultarSolicitudesVacacionesAutorizadasController);
administracionvacacionesRoute.get('/consultarSolicitudesReprogramadas', authorizeRole(1, 3), consultarSolicitudesReprogramadasController);
administracionvacacionesRoute.get('/consultarSolicitudesCanceladas', authorizeRole(1, 3), consultarSolicitudesCanceladasController);
administracionvacacionesRoute.put('/cancelarSolicitudAutorizada', authorizeRole(1, 3), auditMiddleware("CANCELACION_VACACIONES_RRHH"), cancelarSolicitudAutorizadaController);
administracionvacacionesRoute.put('/cancelarSolicitudParcial', authorizeRole(1, 3), auditMiddleware("CANCELACION_PARCIAL_RRHH"), cancelarSolicitudParcialController);
