import { Router } from "express";
import { authorizeRole } from "../../../middlewares/rolemiddleware.js";
import { procesarSucesionPuestoController, procesarBajaEmpleadoController } from "../../controller/empleados/movimientos.controller.js";

const movimientosRoute = Router();

// Endpoint para registrar el cambio de puesto de un empleado
movimientosRoute.post('/cambio-puesto', authorizeRole(1, 3), procesarSucesionPuestoController);

// Endpoint para registrar la baja de un empleado
movimientosRoute.post('/baja-empleado', authorizeRole(1, 3), procesarBajaEmpleadoController);

export default movimientosRoute;
