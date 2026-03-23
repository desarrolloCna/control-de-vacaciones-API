import { Router } from "express";
import { GetSuspensionesController, ingresarSuspensionController } from "../../controller/suspensiones/suspensiones.controller.js";


export const suspensionesRoute = Router();

suspensionesRoute.get('/getSuspensiones', GetSuspensionesController);
suspensionesRoute.post('/ingresarSuspension', ingresarSuspensionController);
