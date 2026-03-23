import { Router } from "express";
import { IngresarEmpleadoController } from "../../Controller/empleados/empleados.controller.js";
import { consultarEmpleadosSinVacacionesController, consultarEmpleadosUltimoAnioController, employeesListController, obtenerDatosLaboralesController } from "../../Controller/empleados/GetDataEmpleados.controller.js";
import { actualizarDatosLaboralesController, actualizarInfoPersonalController, actualizarOtrosDatosController, actualizarInfoDpiController } from "../../Controller/empleados/ActualizarData.controller.js";

export const empleadosRoute = Router();

empleadosRoute.post('/ingresarEmpleado', IngresarEmpleadoController);
empleadosRoute.get('/employeesList', employeesListController);
empleadosRoute.get('/obtenerDatosLaborales/:idInfoPersonal', obtenerDatosLaboralesController);
empleadosRoute.get('/consultarEmpleadosUltimoAnio', consultarEmpleadosUltimoAnioController);
empleadosRoute.get('/consultarEmpleadosSinVacaciones', consultarEmpleadosSinVacacionesController);
empleadosRoute.put('/actualizarDatosLaborales/:idEmpleado', actualizarDatosLaboralesController);
empleadosRoute.put('/actualizarInfoPersonal/:idInfoPersonal', actualizarInfoPersonalController);
empleadosRoute.put('/actualizarOtrosDatos/:idInfoPersonal', actualizarOtrosDatosController);
empleadosRoute.put('/actualizarDpi/:idInfoPersonal', actualizarInfoDpiController);
