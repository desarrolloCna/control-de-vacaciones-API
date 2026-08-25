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
import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { debitarDiasPorPeriodoService } from "../../services/vacationapp/hisotrialvacaciones/controldedias.service.js";

export const cancelarSolicitudAutorizadaService = async (idSolicitud, fechaResolucion, motivoReprogramacion, diasADevolver, idUsuarioSession, usuarioSession) => {
    try{
        const checkQuery = `SELECT idEmpleado, idInfoPersonal, cantidadDiasSolicitados FROM solicitudes_vacaciones WHERE idSolicitud = ?`;
        const checkResult = await Connection.execute(checkQuery, [idSolicitud]);
        
        if (checkResult.rows.length > 0) {
            const reqData = checkResult.rows[0];
            
            // Validar que no se devuelvan más días de los solicitados
            if (diasADevolver > reqData.cantidadDiasSolicitados) {
                const error = new Error(`Los días a devolver (${diasADevolver}) no pueden ser mayores a los solicitados (${reqData.cantidadDiasSolicitados}).`);
                error.codRes = 400;
                throw error;
            }

            const esCancelacionTotal = (diasADevolver === reqData.cantidadDiasSolicitados);
            
            if (esCancelacionTotal) {
                // CANCELACIÓN TOTAL: No se gozó ningún día.
                // Si ya existían débitos (por el cron de finalización), los eliminamos.
                console.log(`[Cancelacion URRHH] Cancelación TOTAL de solicitud ${idSolicitud}. Eliminando débitos existentes.`);
                await Connection.execute(
                    `DELETE FROM historial_vacaciones WHERE idSolicitud = ? AND diasDebitados > 0`,
                    [idSolicitud]
                );
                // NO hacemos débito anticipado, NO creamos crédito. El historial queda limpio.
            } else {
                // CANCELACIÓN PARCIAL: Se gozaron algunos días.
                // Necesitamos que exista un débito del total original para luego acreditar la diferencia.
                const debitCheckQuery = `SELECT 1 FROM historial_vacaciones WHERE idSolicitud = ? AND diasDebitados > 0 LIMIT 1`;
                const debitCheckResult = await Connection.execute(debitCheckQuery, [idSolicitud]);
                
                if (debitCheckResult.rows.length === 0) {
                    console.log(`[Cancelacion URRHH] Realizando debito anticipado para la solicitud ${idSolicitud}`);
                    await debitarDiasPorPeriodoService({
                        idSolicitud: idSolicitud,
                        idEmpleado: reqData.idEmpleado,
                        idInfoPersonal: reqData.idInfoPersonal,
                        cantidadDiasSolicitados: reqData.cantidadDiasSolicitados
                    });
                }
            }
        }
        
        const result = await cancelarSolicitudAutorizadaDaDao(idSolicitud, fechaResolucion, motivoReprogramacion, diasADevolver, idUsuarioSession, usuarioSession);
        
        await EnviarMailReprogramacionRRHH(idSolicitud, motivoReprogramacion, result?.nuevosDias);

        return result;
    }catch(error){
        console.log("Error en cancelarSolicitudAutorizadaService:", error);
        throw error;
    }
}
