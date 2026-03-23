import { Router } from "express";
import { getCalendarioController } from "../../Controller/Calendario/Calendario.controller.js";

export const calendarioRoute = Router();

calendarioRoute.get('/calendario/vacaciones', getCalendarioController);
