import { Router } from "express";
import { registrarBitacoraController, obtenerBitacoraController } from "../../Controller/bitacora/bitacora.controller.js";
import { BitacoraRestaurarController } from "../../Controller/bitacora/restaurar.controller.js";

export const bitacoraRoute = Router();

bitacoraRoute.get("/obtenerBitacora", obtenerBitacoraController);
bitacoraRoute.post("/registrarBitacora", registrarBitacoraController);
bitacoraRoute.post("/restaurarBitacora", BitacoraRestaurarController.restaurarRegistro);
