import { Router } from "express";
import { getCalendarioController } from "../../controller/calendario/calendario.controller.js";

export const calendarioRoute = Router();

calendarioRoute.get('/calendario/vacaciones', getCalendarioController);
