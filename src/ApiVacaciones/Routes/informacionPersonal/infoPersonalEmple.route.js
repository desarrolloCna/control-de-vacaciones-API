import { Router } from "express";
import { IngresarInfoPersonalController } from "../../controller/informacionpersonal/infopersonalemple.controller.js";
import { obtenerInfoPersonalController } from "../../controller/informacionpersonal/getinfopersonal.controller.js";
import { actualizarInfoPersonalController } from "../../controller/empleados/actualizardata.controller.js";
import { getCumpleanerosDelMes } from "../../controller/informacionpersonal/cumpleaneros.controller.js";

export const infoEmpleRoute = Router();

infoEmpleRoute.post('/infoPersonalEmpleado', IngresarInfoPersonalController);
infoEmpleRoute.get('/obtenerInfoPersonal/:idInfoPersonal', obtenerInfoPersonalController);
infoEmpleRoute.put('/actualizarInfoPersonal/:idInfoPersonal', actualizarInfoPersonalController);
infoEmpleRoute.get('/cumpleaneros', getCumpleanerosDelMes);
