import { consultarSolicitudesPorEmpleadoDao, getSolicitudesByIdDao } from "../../dao/vacationapp/getsolicitudbyid.dao.js";
import dayjs from "dayjs";
import { consultarGestionVacacionesEspecialesDao } from "../../modules/vacacionesespeciales/vacacionesespeciales.dao.js";
import { consultarPeriodosYDiasPorEmpeladoDao } from "../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import { obtenerPeriodosParaVacaciones } from "./hisotrialvacaciones/calculodedias.service.js";

export const getSolicitudesByIdServices = async (idEmpleado, idInfoPersonal) => {
    try{
          const solicitud = await getSolicitudesByIdDao(idEmpleado, idInfoPersonal);
          return solicitud;
    }catch(error){
       throw error;
 
    }
  }

export const consultarSolicitudesPorEmpleadoServices = async (idEmpleado) => {
  try {
    const solicitudes = await consultarSolicitudesPorEmpleadoDao(idEmpleado);
    
    const anioActual = dayjs().year();
    const fechaActual = dayjs().format("YYYY-MM-DD");

    const solicitudesConDesglose = await Promise.all(solicitudes.map(async (solicitud) => {
        const solicitudObj = { ...solicitud };
        try {
            let excluirAnioActual = anioActual;
            const permiso = await consultarGestionVacacionesEspecialesDao(solicitudObj.idEmpleado, fechaActual);
            
            if (permiso && permiso.isExist > 0) {
                excluirAnioActual = null;
            }

            const periodos = await consultarPeriodosYDiasPorEmpeladoDao(solicitudObj.idEmpleado, excluirAnioActual);
            const diasPorPeriodo = obtenerPeriodosParaVacaciones(periodos, solicitudObj.cantidadDiasSolicitados);
            
            if (diasPorPeriodo && diasPorPeriodo.length > 0) {
                solicitudObj.desglosePeriodos = diasPorPeriodo.map(p => `${p.diasTomados} días (${p.periodo})`).join(', ');
            } else {
                solicitudObj.desglosePeriodos = "Sin saldo suficiente o calculando...";
            }
        } catch (e) {
            console.error("Error calculando desglose para solicitud:", solicitudObj.idSolicitud, e);
            solicitudObj.desglosePeriodos = "Error al calcular saldo";
        }
        return solicitudObj;
    }));

    return solicitudesConDesglose;
  } catch(error) {
    throw error;
  }
}
