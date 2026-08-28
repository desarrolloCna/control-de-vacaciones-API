

import { Router } from "express";
import { cancelarSolicitudAutorizadaController, consultarSolicitudesVacacionesAutorizadasController, consultarSolicitudesReprogramadasController } from "./administracionvacaciones.controller.js";
import { authorizeRole } from "../../../middlewares/rolemiddleware.js";
import { auditMiddleware } from "../../../middlewares/auditmiddleware.js";

export const administracionvacacionesRoute = Router();

administracionvacacionesRoute.get('/consultarSolicitudesVacacionesAutorizadas', authorizeRole(1, 3), consultarSolicitudesVacacionesAutorizadasController);
administracionvacacionesRoute.get('/consultarSolicitudesReprogramadas', authorizeRole(1, 3), consultarSolicitudesReprogramadasController);
administracionvacacionesRoute.put('/cancelarSolicitudAutorizada', authorizeRole(1, 3), auditMiddleware("CANCELACION_VACACIONES_RRHH"), cancelarSolicitudAutorizadaController);
