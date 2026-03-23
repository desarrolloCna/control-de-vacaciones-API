import { Router } from "express";
import { IngresarFamiliarController } from "../../controller/familiares/familiaresemple.controller.js";
import { obtenerFamiliaresController } from "../../controller/familiares/getfamiliares.controller.js";

export const familiaresRoute = Router();

familiaresRoute.post('/ingresarFamiliar', IngresarFamiliarController);
familiaresRoute.get('/obtenerFamiliares/:idEmpleado', obtenerFamiliaresController);
