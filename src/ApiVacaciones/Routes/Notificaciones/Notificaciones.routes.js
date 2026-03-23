import { Router } from "express";
import { 
  getNotificacionesController, 
  marcarNotificacionLeidaController,
  crearNotificacionController
} from "../../Controller/Notificaciones/Notificaciones.controller.js";

export const notificacionesRoute = Router();

notificacionesRoute.get('/notificaciones', getNotificacionesController);
notificacionesRoute.post('/notificaciones', crearNotificacionController);
notificacionesRoute.put('/notificaciones/:idNotificacion/leer', marcarNotificacionLeidaController);
