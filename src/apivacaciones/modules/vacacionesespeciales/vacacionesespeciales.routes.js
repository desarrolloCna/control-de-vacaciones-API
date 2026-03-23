import { Router } from "express";
import { consultarGestionVacacionesEspecialesController, registrarVacacionesEspecialesController, registrarExcepcionLimiteController, consultarExcepcionLimiteController } from "./vacacionesespeciaels.controller.js";

export const vacacionesespecialesRoute = Router();

vacacionesespecialesRoute.post('/registrarVacacionesEspeciales', registrarVacacionesEspecialesController);
vacacionesespecialesRoute.get('/consultarVacacionesEspeciales', consultarGestionVacacionesEspecialesController);

vacacionesespecialesRoute.post('/registrarExcepcionLimite', registrarExcepcionLimiteController);
vacacionesespecialesRoute.get('/consultarExcepcionLimite', consultarExcepcionLimiteController);
