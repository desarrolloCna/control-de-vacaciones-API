import { Router } from "express";
import { actualizarCelularController, cambiarPasswordController } from "../../controller/autoservicio/autoservicio.controller.js";

export const autoservicioRouter = Router();

autoservicioRouter.put("/empleado/actualizar-celular", actualizarCelularController);
autoservicioRouter.put("/empleado/cambiar-password", cambiarPasswordController);
