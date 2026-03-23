import { Router } from "express";
import { consultarCoordinadorController, consultarCoordinadoresListController, registrarCoordinadorController } from "../../Controller/Coordinadores/Coordinadores.Controller.js";

export const coordinadoresRoute = Router();

coordinadoresRoute.get('/consultarCoordinador', consultarCoordinadorController);
coordinadoresRoute.post('/registrarCoordinador', registrarCoordinadorController);
coordinadoresRoute.get('/consultarCoordinadoresList', consultarCoordinadoresListController);