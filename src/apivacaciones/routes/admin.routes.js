import { Router } from "express";
import { registrarBitacoraController, obtenerBitacoraController } from "../controller/bitacora/bitacora.controller.js";
import { BitacoraRestaurarController } from "../controller/bitacora/restaurar.controller.js";
import { UsuariosRRHHController } from "../controller/usuarios/usuariosrrhh.controller.js";
import { authorizeRole } from "../../middlewares/rolemiddleware.js";

export const adminRoute = Router();

// Middleware de rol: Solo Super Admin (rol 1)
adminRoute.use(authorizeRole(1));

// Bitacora
adminRoute.get("/obtenerBitacora", obtenerBitacoraController);
adminRoute.post("/registrarBitacora", registrarBitacoraController);
adminRoute.post("/restaurarBitacora", BitacoraRestaurarController.restaurarRegistro);

// RRHH
adminRoute.get("/obtenerRRHH", UsuariosRRHHController.obtenerUsuariosRRHH);
adminRoute.post("/crearRRHH", UsuariosRRHHController.crearUsuarioRRHH);
adminRoute.put("/actualizarRRHH/:id", UsuariosRRHHController.actualizarUsuarioRRHH);
adminRoute.delete("/eliminarRRHH/:id", UsuariosRRHHController.eliminarUsuarioRRHH);
