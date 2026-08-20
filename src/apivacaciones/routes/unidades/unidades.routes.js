import { Router } from "express";
import { getJerarquiaUnidadesController } from "../../controller/unidades/unidades.controller.js";

export const unidadesRoute = Router();

unidadesRoute.get('/unidades/jerarquia', getJerarquiaUnidadesController);
