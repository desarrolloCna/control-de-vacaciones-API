import { cancelarSolicitudAutorizadaDaDao, consultarSolicitudesVacacionesAutorizadasDao } from "./administracionvacaciones.dao.js";


export const consultarSolicitudesVacacionesAutorizadasService = async () => {
    try{
        const result = await consultarSolicitudesVacacionesAutorizadasDao();
        return result;
    }catch(error){
        console.log("Error en consultarSolicitudesVacacionesAutorizadasService:", error);
        throw error;
    }
}

import { EnviarMailReprogramacionRRHH } from "../serviciosgenerales/enviodecorreos/enviocorreoRRHH.service.js";
import { getSolicitudesByIdSolcitudDao } from "../../dao/vacationapp/getsolicitudbyid.dao.js";

export const cancelarSolicitudAutorizadaService = async (idSolicitud, fechaResolucion, motivoReprogramacion, idUsuarioSession, usuarioSession) => {
    try{
        const result = await cancelarSolicitudAutorizadaDaDao(idSolicitud, fechaResolucion, motivoReprogramacion, idUsuarioSession, usuarioSession);
        
        // Fetch full request details to get the institutional email
        // We need the employee ID. Wait, getSolicitudesByIdSolcitudDao requires idEmpleado, which we don't know yet!
        // We can just query it directly or have getSolicitudesByIdSolcitudDao only need idSolicitud.
        // I will let the new enviocorreoRRHH.service do the querying if necessary, or do it here.
        // Actually, since we don't have idEmpleado, I should require idEmpleado from the frontend payload or just query it here. Let's do it in the mail service where we can just query the request.
        await EnviarMailReprogramacionRRHH(idSolicitud, motivoReprogramacion);

        return result;
    }catch(error){
        console.log("Error en cancelarSolicitudAutorizadaService:", error);
        throw error;
    }
}
