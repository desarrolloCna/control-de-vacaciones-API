import { cancelarSolicitudAutorizadaDaDao, consultarSolicitudesVacacionesAutorizadasDao, consultarSolicitudesReprogramadasDao, cancelarSolicitudParcialDao, consultarSolicitudesCanceladasDao } from "./administracionvacaciones.dao.js";


export const consultarSolicitudesVacacionesAutorizadasService = async () => {
    try{
        const result = await consultarSolicitudesVacacionesAutorizadasDao();
        return result;
    }catch(error){
        console.log("Error en consultarSolicitudesVacacionesAutorizadasService:", error);
        throw error;
    }
}

export const consultarSolicitudesReprogramadasService = async () => {
    try {
        const result = await consultarSolicitudesReprogramadasDao();
        return result;
    } catch (error) {
        console.log("Error en consultarSolicitudesReprogramadasService:", error);
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

import { getDiasFestivosServices } from "../../services/diasfestivos/diasfestivos.service.js";
import { calcularRetornoYFestivosBackend } from "../../utils/dateutils.js";

import { EnviarMailCancelacionParcialRRHH } from "../serviciosgenerales/enviodecorreos/enviocorreoRRHH.service.js";

export const cancelarSolicitudParcialService = async (idSolicitud, diasGozados, motivo, tipoCancelacion, fechaReintegro, idUsuarioSession, usuarioSession) => {
    try {
        // 1. Calculate new return date based on diasGozados
        const solicitudData = await getSolicitudesByIdSolcitudDao(idSolicitud);
        if (!solicitudData) throw new Error("Solicitud no encontrada para recálculo");
        
        let fechaFinCalculada = solicitudData.fechaFinVacaciones;
        let proximaFechaLaboralCalculada = solicitudData.fechaRetornoLabores;

        if (diasGozados > 0) {
            const diasFestivos = await getDiasFestivosServices();
            const calc = calcularRetornoYFestivosBackend(solicitudData.fechaInicioVacaciones, diasGozados, diasFestivos);
            fechaFinCalculada = calc.fechaFin;
            proximaFechaLaboralCalculada = calc.proximaFechaLaboral;
        }

        const motivoCompleto = tipoCancelacion ? `[${tipoCancelacion}] ${motivo}` : motivo;

        // 2. Ejecutar la cancelación en BD
        const result = await cancelarSolicitudParcialDao(idSolicitud, diasGozados, motivoCompleto, fechaReintegro, fechaFinCalculada, proximaFechaLaboralCalculada, idUsuarioSession, usuarioSession);
        
        // 3. Enviar correo al empleado notificando
        if (solicitudData.correoInstitucional) {
            await EnviarMailCancelacionParcialRRHH({
                correo: solicitudData.correoInstitucional,
                nombre: solicitudData.nombreCompleto,
                diasOriginales: solicitudData.cantidadDiasSolicitados,
                diasGozados,
                diasDevueltos: result.diasDevueltos,
                motivo: motivoCompleto,
                fechaReintegro: fechaReintegro || proximaFechaLaboralCalculada,
                fechaInicio: solicitudData.fechaInicioVacaciones,
                nuevaFechaFin: fechaFinCalculada
            });
        }

        return result;
    } catch (error) {
        console.log("Error en cancelarSolicitudParcialService:", error);
        throw error;
    }
}

export const consultarSolicitudesCanceladasService = async () => {
    try {
        const result = await consultarSolicitudesCanceladasDao();
        return result;
    } catch (error) {
        console.log("Error en consultarSolicitudesCanceladasService:", error);
        throw error;
    }
}
