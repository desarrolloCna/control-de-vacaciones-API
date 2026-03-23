import { Router } from "express";
import { consultarCoordinadorController, consultarCoordinadoresListController, registrarCoordinadorController } from "../../controller/coordinadores/coordinadores.controller.js";

export const coordinadoresRoute = Router();

coordinadoresRoute.get('/consultarCoordinador', consultarCoordinadorController);
coordinadoresRoute.post('/registrarCoordinador', registrarCoordinadorController);
coordinadoresRoute.get('/consultarCoordinadoresList', consultarCoordinadoresListController);
