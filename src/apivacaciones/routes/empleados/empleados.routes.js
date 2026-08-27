import { Router } from "express";
import { IngresarEmpleadoController } from "../../controller/empleados/empleados.controller.js";
import { consultarEmpleadosSinVacacionesController, consultarEmpleadosUltimoAnioController, employeesListController, obtenerDatosLaboralesController, resumenAnualVacacionesController, consultarEmpleadosIncompletosController } from "../../controller/empleados/getdataempleados.controller.js";
import { actualizarDatosLaboralesController, actualizarInfoPersonalController, actualizarOtrosDatosController, actualizarInfoDpiController } from "../../controller/empleados/actualizardata.controller.js";

export const empleadosRoute = Router();

empleadosRoute.post('/ingresarEmpleado', IngresarEmpleadoController);
empleadosRoute.get('/employeesList', employeesListController);
empleadosRoute.get('/employeesList/resumen-anual-011-022', resumenAnualVacacionesController);
empleadosRoute.get('/obtenerDatosLaborales/:idInfoPersonal', obtenerDatosLaboralesController);
empleadosRoute.get('/consultarEmpleadosUltimoAnio', consultarEmpleadosUltimoAnioController);
empleadosRoute.get('/consultarEmpleadosSinVacaciones', consultarEmpleadosSinVacacionesController);
empleadosRoute.put('/actualizarDatosLaborales/:idEmpleado', actualizarDatosLaboralesController);
empleadosRoute.put('/actualizarInfoPersonal/:idInfoPersonal', actualizarInfoPersonalController);
empleadosRoute.put('/actualizarOtrosDatos/:idInfoPersonal', actualizarOtrosDatosController);
empleadosRoute.put('/actualizarDpi/:idInfoPersonal', actualizarInfoDpiController);
empleadosRoute.get('/empleados-incompletos', consultarEmpleadosIncompletosController);
