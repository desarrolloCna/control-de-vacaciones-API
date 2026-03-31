import { Router } from "express";
import { cancelarSolicitudAutorizadaController, consultarSolicitudesVacacionesAutorizadasController } from "./administracionvacaciones.controller.js";
import { authorizeRole } from "../../../middlewares/rolemiddleware.js";
import { auditMiddleware } from "../../../middlewares/auditmiddleware.js";

export const administracionvacacionesRoute = Router();

// Proteger todo el router: Solo Super Admin (1) o RRHH (3)
administracionvacacionesRoute.use(authorizeRole(1, 3));

administracionvacacionesRoute.get('/consultarSolicitudesVacacionesAutorizadas', consultarSolicitudesVacacionesAutorizadasController);
administracionvacacionesRoute.put('/cancelarSolicitudAutorizada', auditMiddleware("CANCELACION_VACACIONES_RRHH"), cancelarSolicitudAutorizadaController);
