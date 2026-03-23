import { consultarDiasDebitadosPorAnioDao, consultarDiasDisponiblesDao, obtenerHistorialPorEmpleadoDao, obtenerDatosEmpleadoParaAcumulacionDao } from "../../../Dao/VacationApp/HistorialVacaciones/ConsultasHistorial.dao.js";
import dayjs from "dayjs";
import { consultarGestionVacacionesEspecialesDao } from "../../../modules/vacacionesespeciales/vacacionesespeciales.dao.js";

import { acreditarDiasPorPeriodoService } from "./ControlDeDias.service.js";

export const obtenerHistorialPorEmpleadoService = async (idEmpleado) => {
    try{
          const datosEmpleado = await obtenerDatosEmpleadoParaAcumulacionDao(idEmpleado);
          if (datosEmpleado) {
              await acreditarDiasPorPeriodoService(datosEmpleado);
          }

          const historial = await obtenerHistorialPorEmpleadoDao(idEmpleado);
          return historial;
    }catch(error){
       throw error;
    }
}

export const consultarDiasDebitadosPorAnioServices = async (idEmpleado, anio) => {
      try{
          const historial = await consultarDiasDebitadosPorAnioDao(idEmpleado, anio);
          return historial;
    }catch(error){
       throw error;
    }
}

export const consultarDiasDisponiblesServices = async (idEmpleado) => {
    try{
          const anioActual = dayjs().year();
          const fechaActual = dayjs().format("YYYY-MM-DD");
          
          let excluirAnioActual = anioActual;
          // Validar si tiene habilitadas vacaciones anticipadas
          const permiso = await consultarGestionVacacionesEspecialesDao(idEmpleado, fechaActual);
          if (permiso && permiso.isExist > 0) {
              excluirAnioActual = null;
          }

          const historial = await consultarDiasDisponiblesDao(idEmpleado, excluirAnioActual);
          const historialTotales = await consultarDiasDisponiblesDao(idEmpleado, null);

          return {
            diasDisponibles: historial.diasDisponibles,
            diasTotales: historialTotales.diasDisponibles
          };
    }catch(error){
       throw error;
    }
}