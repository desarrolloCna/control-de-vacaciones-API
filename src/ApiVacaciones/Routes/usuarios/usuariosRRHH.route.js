import { Router } from "express";
import { UsuariosRRHHController } from "../../controller/usuarios/usuariosrrhh.controller.js";

export const usuariosRRHHRoute = Router();

// Endpoints simplificados para evitar conflictos
usuariosRRHHRoute.get("/obtenerRRHH", UsuariosRRHHController.obtenerUsuariosRRHH);
usuariosRRHHRoute.post("/crearRRHH", UsuariosRRHHController.crearUsuarioRRHH);
usuariosRRHHRoute.delete("/eliminarRRHH/:id", UsuariosRRHHController.eliminarUsuarioRRHH);
