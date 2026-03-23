import { Router } from "express";
import { registrarBitacoraController, obtenerBitacoraController } from "../../controller/bitacora/bitacora.controller.js";
import { BitacoraRestaurarController } from "../../controller/bitacora/restaurar.controller.js";

export const bitacoraRoute = Router();

bitacoraRoute.get("/obtenerBitacora", obtenerBitacoraController);
bitacoraRoute.post("/registrarBitacora", registrarBitacoraController);
bitacoraRoute.post("/restaurarBitacora", BitacoraRestaurarController.restaurarRegistro);
