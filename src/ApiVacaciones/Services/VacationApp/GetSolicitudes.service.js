import { consultarDiasSolicitadosPorAnioDao, getSolicitudesDao } from "../../dao/vacationapp/getsolicitudes.dao.js";

export const getSolicitudesServices = async (idCoordinador) => {
    try{
          const solicitudes = await getSolicitudesDao(idCoordinador);
          return solicitudes;
    }catch(error){
       throw error;
 
    }
}

export const consultarDiasSolicitadosPorAnioServices = async (idEmpleado, anio) => {
  try {
    const diasSolicitados = await consultarDiasSolicitadosPorAnioDao(idEmpleado, anio);
    return diasSolicitados;
  } catch (error) {
    throw error;
  }
}
