import dayjs from "dayjs";
import { consultarPeriodosYDiasPorEmpeladoDao } from "../../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import { actualizarSaldoManualDao, acreditarDiasPorPeriodoLoteDao, ActualizarDiasAcumuladosPorPeriodoDao, debitarDiasPorPeriodoDao, getUltiaAcreditacionDiasDao, } from "../../../dao/vacationapp/historialvacaciones/controldedias.dao.js";
import { destructurarFecha, destructurarFechaActual, formatearFecha, validarFechaUltimaActualizacion, } from "../../utils/dateutils.js";
import { generarDiasAcumuladosPorPeriodo, obtenerPeriodosParaVacaciones } from "./calculodedias.service.js";
import { actualizarEstadoSolicitudDao } from "../../../dao/vacationapp/modificarsolicitud.dao.js";
import { getSuspensionesByEmpleadoDao } from "../../../dao/suspensiones/suspensiones.dao.js";
import { consultarGestionVacacionesEspecialesDao } from "../../../modules/vacacionesespeciales/vacacionesespeciales.dao.js";

/**
 * Servicio para acreditar días de vacaciones por periodo para un empleado o grupo de empleados.
 *
 * @async
 * @function acreditarDiasPorPeriodoService
 * @param {Object} data - Datos del empleado o grupo de empleados para procesar la acreditación.
 * @param {string} data.fechaIngreso - Fecha de ingreso del empleado (formato YYYY-MM-DD).
 * @param {string} [data.fechaUpdate] - Fecha de última actualización, si corresponde (formato YYYY-MM-DD).
 * @returns {Promise<number>} - Número de filas afectadas o insertadas en la base de datos.
 * @throws {Error} - Lanza un error si falla algún proceso de inserción o actualización.
 */
export const acreditarDiasPorPeriodoService = async (data) => {
  try {
    const ultimoIngresoDeDias = await getUltiaAcreditacionDiasDao(data.idEmpleado);

    // Validar y asignar la fecha de actualización si existe un último ingreso de días
    if (ultimoIngresoDeDias) {
      data.fechaUpdate = formatearFecha(ultimoIngresoDeDias.fechaActualizacion);
    }

    console.log("-----------------------------------------");
    console.log("INICIO ACREDITACION DE DIAS ACUMULADOS");

    // Traer posibles suspensiones para el cálculo exacto
    try {
        const suspensiones = await getSuspensionesByEmpleadoDao(data.idEmpleado);
        data.suspensiones = suspensiones;
    } catch (e) {
        data.suspensiones = [];
    }

    // Genera el payload para la acumulación de días por periodo
    const payload = generarDiasAcumuladosPorPeriodo(data);

    // Si hay una fecha de actualización, verifica si es necesaria la actualización
    if (data.fechaUpdate && !validarFechaUltimaActualizacion(data.fechaUpdate)) {
      console.log("No es necesario actualizar ahora");
      return 0;
    }

    // Actualizar o insertar días acumulados
    let resultado;
    if(data.fechaUpdate && destructurarFecha(data.fechaUpdate).anio === destructurarFechaActual().anioEnCurso){
      
      resultado = await ActualizarDiasAcumuladosPorPeriodoDao(payload);
    
    }else if(data.fechaUpdate && destructurarFecha(data.fechaUpdate).anio !== destructurarFechaActual().anioEnCurso){

      payload.forEach(async (periodo, index) => {

          if(periodo.tipoIngreso === 'insert'){
            resultado = await acreditarDiasPorPeriodoLoteDao([periodo]);
          }

          if(periodo.tipoIngreso === 'update'){
            resultado = await ActualizarDiasAcumuladosPorPeriodoDao(periodo);
          }

      });


    }
    else{
      resultado = await acreditarDiasPorPeriodoLoteDao(payload);
    }

    return resultado;
  } catch (error) {
    console.error("Error en la acreditación de días acumulados:", error);
    throw error;
  }
};

export const debitarDiasPorPeriodoService = async (datosSolicitud) => {
  try {
    const anioActual = dayjs().year();
    const fechaActual = dayjs().format("YYYY-MM-DD");
    let excluirAnioActual = anioActual;

    // Validar si tiene habilitadas vacaciones anticipadas
    const permiso = await consultarGestionVacacionesEspecialesDao(datosSolicitud.idEmpleado, fechaActual);
    if (permiso && permiso.isExist > 0) {
        excluirAnioActual = null;
    }

    //Obtener los periodos y dias de los mismos de cada empleado
    const periodos = await consultarPeriodosYDiasPorEmpeladoDao(datosSolicitud.idEmpleado, excluirAnioActual);

    if (periodos && periodos.length > 0) {
      //calcular los dias a debitar
      const diasPorPeriodo = obtenerPeriodosParaVacaciones(periodos, datosSolicitud.cantidadDiasSolicitados);

      const payload = diasPorPeriodo.map((periodo) => {
          return {
            idEmpleado: datosSolicitud.idEmpleado,
            idInfoPersonal: datosSolicitud.idInfoPersonal,
            idSolicitud: datosSolicitud.idSolicitud,
            anioPeriodo: periodo.periodo,
            diasSolicitados: periodo.diasTomados,
            diasDebitados: periodo.diasTomados,
            diasDisponibles: periodo.diasDisponibles,
            fechaActualizacion: dayjs().format("YYYY-MM-DD"),
            tipoRegistro: 2,
          };
      });

      const resultado = await debitarDiasPorPeriodoDao(payload);

      if (resultado >= 0) {
        const payloadActualizarEstado = {
          estadoSolicitud: "finalizadas",
          idSolicitud: datosSolicitud.idSolicitud,
          idEmpleado: datosSolicitud.idEmpleado,
        };

        await actualizarEstadoSolicitudDao(payloadActualizarEstado);
      }

      return resultado;
    }

    // return 0;
  } catch (error) {
    console.error("Error en la debitura de días acumulados:", error);
    throw error;
  }
};

export const actualizarSaldoManualService = async (data) => {
  try {
    return await actualizarSaldoManualDao(data);
  } catch (error) {
    console.error("Error en actualizarSaldoManualService:", error);
    throw error;
  }
};
