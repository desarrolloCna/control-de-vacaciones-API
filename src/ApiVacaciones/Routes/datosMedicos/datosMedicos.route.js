import { Router } from "express";
import { IngresarDatosMedicosController } from "../../controller/datosmedicos/datosmedicos.controller.js";
import { obtenerDatosMedicosController } from "../../controller/datosmedicos/getdatosmedicos.controller.js";


export const datosMedicosRoute = Router();

datosMedicosRoute.post('/ingresarDatosMedicos', IngresarDatosMedicosController);
datosMedicosRoute.get('/obtenerDatosMedicos/:idInfoPersonal', obtenerDatosMedicosController);
