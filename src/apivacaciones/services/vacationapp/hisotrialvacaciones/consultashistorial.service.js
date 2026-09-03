import { consultarDiasDebitadosPorAnioDao, consultarDiasDisponiblesDao, consultarDiasDisponiblesPorPeriodoDao, obtenerHistorialPorEmpleadoDao, obtenerDatosEmpleadoParaAcumulacionDao } from "../../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import dayjs from "dayjs";
import { consultarGestionVacacionesEspecialesDao } from "../../../modules/vacacionesespeciales/vacacionesespeciales.dao.js";

import { acreditarDiasPorPeriodoService } from "./controldedias.service.js";

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

          // Acreditados
          const historialAcumuladosPrevios = await consultarDiasDisponiblesDao(idEmpleado, excluirAnioActual);
          const historialAcumuladosGlobal = await consultarDiasDisponiblesDao(idEmpleado, null);
          const historialAcumuladosPeriodo = await consultarDiasDisponiblesPorPeriodoDao(idEmpleado, anioActual);
          
          // Debitados
          const debitos = await consultarDiasDebitadosPorAnioDao(idEmpleado, anioActual);

          // Saldo del periodo: Lo que se le acreditó en el año actual, menos lo que solicitó este año.
          const acreditadosPeriodo = historialAcumuladosPeriodo.diasDisponiblesPeriodo || 0;
          const debitadosPeriodo = debitos.diasDebitadosPeriodo || 0;
          
          // Saldo Global: Lo que se le ha acreditado en toda su historia, menos todo lo que ha consumido en su historia.
          const acreditadosGlobal = historialAcumuladosGlobal.diasDisponibles || 0;
          const debitadosGlobal = debitos.diasDebitadosTotales || 0;

          return {
            periodoActual: {
              anio: anioActual,
              acreditados: acreditadosPeriodo,
              consumidos: debitadosPeriodo,
              disponibles: acreditadosPeriodo - debitadosPeriodo
            },
            global: {
              acreditados: acreditadosGlobal,
              consumidos: debitadosGlobal,
              disponibles: acreditadosGlobal - debitadosGlobal
            },
            diasDisponibles: historialAcumuladosPrevios.diasDisponibles, // Mantenemos por retrocompatibilidad si alguien más lo usa
            diasTotales: acreditadosGlobal // Mantenemos por retrocompatibilidad
          };
    }catch(error){
       throw error;
    }
}
