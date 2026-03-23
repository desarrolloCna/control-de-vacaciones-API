import { Router } from "express";
import { registrarBitacoraController, obtenerBitacoraController } from "../Controller/bitacora/bitacora.controller.js";
import { BitacoraRestaurarController } from "../Controller/bitacora/restaurar.controller.js";
import { UsuariosRRHHController } from "../Controller/usuarios/usuariosRRHH.controller.js";

export const adminRoute = Router();

// Bitacora
adminRoute.get("/obtenerBitacora", obtenerBitacoraController);
adminRoute.post("/registrarBitacora", registrarBitacoraController);
adminRoute.post("/restaurarBitacora", BitacoraRestaurarController.restaurarRegistro);

// RRHH
adminRoute.get("/obtenerRRHH", UsuariosRRHHController.obtenerUsuariosRRHH);
adminRoute.post("/crearRRHH", UsuariosRRHHController.crearUsuarioRRHH);
adminRoute.put("/actualizarRRHH/:id", UsuariosRRHHController.actualizarUsuarioRRHH);
adminRoute.delete("/eliminarRRHH/:id", UsuariosRRHHController.eliminarUsuarioRRHH);
