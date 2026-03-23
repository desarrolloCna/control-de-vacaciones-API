import { Router } from "express";
import { IngresarInfoDpiController } from "../../controller/dpi/informaciondpi.controller.js";
import { obtenerInfoDPIController } from "../../controller/dpi/getdatoscui.controller.js";
import { actualizarInfoDpiController } from "../../controller/empleados/actualizardata.controller.js";

export const dpiRoute = Router();

dpiRoute.post('/ingresarInfDpi', IngresarInfoDpiController);
dpiRoute.get('/infoDpi/:idDpi', obtenerInfoDPIController);
dpiRoute.put('/actualizarDpi/:idInfoPersonal', actualizarInfoDpiController);
