import { Router } from "express";
import { obtenerDatosKioscoController } from "../../controller/kiosco/kiosco.controller.js";

export const kioscoRoute = Router();

// Ruta pública para visualización en TV
kioscoRoute.get('/kiosco/datos', obtenerDatosKioscoController);
