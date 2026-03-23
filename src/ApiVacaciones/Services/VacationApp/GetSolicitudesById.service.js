import { consultarSolicitudesPorEmpleadoDao, getSolicitudesByIdDao } from "../../Dao/VacationApp/GetSolicitudById.Dao.js";


export const getSolicitudesByIdServices = async (idEmpleado, idInfoPersonal) => {
    try{
          const solicitud = await getSolicitudesByIdDao(idEmpleado, idInfoPersonal);
          return solicitud;
    }catch(error){
       throw error;
 
    }
  }

export const consultarSolicitudesPorEmpleadoServices = async (idEmpleado) => {
  try{
    const solicitudes = await consultarSolicitudesPorEmpleadoDao(idEmpleado);
    return solicitudes;
  }catch(error){
    throw error;
  }
}