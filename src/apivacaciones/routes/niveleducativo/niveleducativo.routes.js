import { Router } from "express";
import { IngresarNivelEducativoController } from "../../controller/niveleducativo/niveleducativo.controller.js";
import { obtenerNivelEducativoInfoController } from "../../controller/niveleducativo/getniveleducativo.controller.js";


export const nivelEducativoRoute = Router();

nivelEducativoRoute.post('/ingresarNivelEducativo', IngresarNivelEducativoController);
nivelEducativoRoute.get('/getNivelEducativo/:idInfoPersonal', obtenerNivelEducativoInfoController);
