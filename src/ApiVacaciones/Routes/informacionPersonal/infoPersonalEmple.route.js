import { Router } from "express";
import { IngresarInfoPersonalController } from "../../Controller/informacionPersonal/infoPersonalEmple.controller.js";
import { obtenerInfoPersonalController } from "../../Controller/informacionPersonal/GetInfoPersonal.controller.js";
import { actualizarInfoPersonalController } from "../../Controller/empleados/ActualizarData.controller.js";
import { getCumpleanerosDelMes } from "../../Controller/informacionPersonal/cumpleaneros.controller.js";

export const infoEmpleRoute = Router();

infoEmpleRoute.post('/infoPersonalEmpleado', IngresarInfoPersonalController);
infoEmpleRoute.get('/obtenerInfoPersonal/:idInfoPersonal', obtenerInfoPersonalController);
infoEmpleRoute.put('/actualizarInfoPersonal/:idInfoPersonal', actualizarInfoPersonalController);
infoEmpleRoute.get('/cumpleaneros', getCumpleanerosDelMes);