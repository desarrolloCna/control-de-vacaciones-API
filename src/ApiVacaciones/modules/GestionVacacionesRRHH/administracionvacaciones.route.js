import { Router } from "express";
import { cancelarSolicitudAutorizadaController, consultarSolicitudesVacacionesAutorizadasController } from "./administracionvacaciones.controller.js";

export const administracionvacacionesRoute = Router();

administracionvacacionesRoute.get('/consultarSolicitudesVacacionesAutorizadas', consultarSolicitudesVacacionesAutorizadasController);
administracionvacacionesRoute.put('/cancelarSolicitudAutorizada', cancelarSolicitudAutorizadaController);