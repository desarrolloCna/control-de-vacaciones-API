import { Router } from "express";
import { IngresarPertenenciaSoLiController } from "../../controller/pertenenciasociolinguistica/pertenenciasoli.controller.js";
import { obtenerPertenenciaSoliController } from "../../controller/pertenenciasociolinguistica/getpertenenciasoli.controller.js";


export const pertenenciaSoLiRoute = Router();

pertenenciaSoLiRoute.post('/ingresarPertenenciaSoLi', IngresarPertenenciaSoLiController);
pertenenciaSoLiRoute.get('/obtenerInfoSoli/:idInfoPersonal', obtenerPertenenciaSoliController);
