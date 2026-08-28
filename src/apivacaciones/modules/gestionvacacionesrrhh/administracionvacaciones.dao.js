import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { registrarBitacoraDao } from "../../dao/bitacora/bitacora.dao.js";

export const consultarSolicitudesVacacionesAutorizadasDao = async () => {
    try{
        const query = `select sl.idSolicitud, sl.idEmpleado, sl.idInfoPersonal,
                        concat(i.primerNombre, ' ', i.segundoNombre, ' ', i.primerApellido, ' ', i.segundoApellido)nombres,
                        e.puesto, e.coordinacion, e.unidad, sl.idCoordinador, c.nombreCoordinador,
                        sl.fechainicioVacaciones, sl.fechaFinVacaciones, sl.fechaRetornoLabores, sl.cantidadDiasSolicitados, 
                        sl.fechaSolicitud, sl.estadoSolicitud, sl.fechaSolicitud
                        from solicitudes_vacaciones sl
                        join infoPersonalEMpleados i on sl.idInfoPersonal = i.idInfoPersonal
                        join empleados e on sl.idEmpleado = e.idEmpleado
                        join coordinadores c on sl.idCoordinador = c.idCoordinador
                        where sl.estadoSolicitud = 'autorizadas';`;

        const result = await Connection.execute(query);
        return result.rows;
    }catch(error){
        console.log("Error en consultarSolicitudesVacacionesAutorizadas:", error);
        throw error;     
    }
}

export const consultarSolicitudesReprogramadasDao = async () => {
    try{
        const query = `select sl.idSolicitud, sl.idEmpleado, sl.idInfoPersonal,
                        concat(i.primerNombre, ' ', i.segundoNombre, ' ', i.primerApellido, ' ', i.segundoApellido)nombres,
                        e.puesto, e.coordinacion, e.unidad, sl.idCoordinador, c.nombreCoordinador,
                        sl.fechainicioVacaciones, sl.fechaFinVacaciones, sl.fechaRetornoLabores, sl.cantidadDiasSolicitados, 
                        sl.fechaSolicitud, sl.estadoSolicitud, sl.fechaResolucion, sl.descripcionRechazo as motivoReprogramacion
                        from solicitudes_vacaciones sl
                        join infoPersonalEMpleados i on sl.idInfoPersonal = i.idInfoPersonal
                        join empleados e on sl.idEmpleado = e.idEmpleado
                        join coordinadores c on sl.idCoordinador = c.idCoordinador
                        where sl.estadoSolicitud = 'reprogramacion';`;

        const result = await Connection.execute(query);
        return result.rows;
    }catch(error){
        console.log("Error en consultarSolicitudesReprogramadas:", error);
        throw error;     
    }
}

export const consultarSolicitudesCanceladasDao = async () => {
    try{
        const query = `select sl.idSolicitud, sl.idEmpleado, sl.idInfoPersonal,
                        concat(i.primerNombre, ' ', i.segundoNombre, ' ', i.primerApellido, ' ', i.segundoApellido)nombres,
                        e.puesto, e.coordinacion, e.unidad, sl.idCoordinador, c.nombreCoordinador,
                        sl.fechainicioVacaciones, sl.fechaFinVacaciones, sl.fechaRetornoLabores, sl.cantidadDiasSolicitados, 
                        sl.fechaSolicitud, sl.estadoSolicitud, sl.fechaResolucion, sl.descripcionRechazo as motivoReprogramacion
                        from solicitudes_vacaciones sl
                        join infoPersonalEMpleados i on sl.idInfoPersonal = i.idInfoPersonal
                        join empleados e on sl.idEmpleado = e.idEmpleado
                        join coordinadores c on sl.idCoordinador = c.idCoordinador
                        where sl.estadoSolicitud = 'cancelada';`;

        const result = await Connection.execute(query);
        return result.rows;
    }catch(error){
        console.log("Error en consultarSolicitudesCanceladasDao:", error);
        throw error;     
    }
}

export const cancelarSolicitudAutorizadaDaDao = async (idSolicitud, fechaResolucion, motivoReprogramacion, idUsuarioSession, usuarioSession) => {
    try{
        // 1. Delete debited days in historial_vacaciones so the user gets their days refunded
        const queryDeleteHistorial = `DELETE FROM historial_vacaciones WHERE idSolicitud = ? AND diasDebitados > 0`;
        await Connection.execute(queryDeleteHistorial, [idSolicitud]);

        // 2. Update status to 'reprogramacion' and store the reason
        const query = `update solicitudes_vacaciones set estadoSolicitud = 'reprogramacion', 
                        descripcionRechazo = ?,                 
                        fechaResolucion = ?
                        where idSolicitud = ?`;
        const result = await Connection.execute(query, [
            motivoReprogramacion,
            fechaResolucion, 
            idSolicitud]);

        // Registrar en bitácora
        await registrarBitacoraDao({
            idUsuario: idUsuarioSession || 1,
            usuario: usuarioSession || "Admin/RRHH",
            accion: 'UPDATE',
            tabla: 'solicitudes_vacaciones',
            idRegistroAfectado: idSolicitud,
            detallesAnteriores: { estadoSolicitud: 'autorizadas' },
            detallesNuevos: { estadoSolicitud: 'reprogramacion', descripcionRechazo: motivoReprogramacion, fechaResolucion },
            descripcion: `Se canceló y reprogramó la solicitud de vacaciones autorizada ID: ${idSolicitud} por motivo: ${motivoReprogramacion}`
        });

        return result.rows[0];
    }catch(error){
        console.log("Error en cancelarSolicitudAutorizada:", error);
        throw error;     
    }
}

export const cancelarSolicitudParcialDao = async (idSolicitud, diasGozados, motivo, idUsuarioSession, usuarioSession) => {
    try{
        // 1. Fetch the request to know the original days requested
        const qSol = `SELECT idEmpleado, cantidadDiasSolicitados FROM solicitudes_vacaciones WHERE idSolicitud = ? AND estadoSolicitud = 'autorizadas'`;
        const resSol = await Connection.execute(qSol, [idSolicitud]);
        if (resSol.rows.length === 0) {
            throw { codRes: 400, message: "Solicitud no encontrada o no está en estado 'autorizadas'" };
        }
        
        const solicitud = resSol.rows[0];
        const cantidadOriginal = solicitud.cantidadDiasSolicitados;
        const diasDevueltos = cantidadOriginal - diasGozados;
        
        if (diasDevueltos < 0) {
            throw { codRes: 400, message: "Los días gozados no pueden ser mayores a los solicitados" };
        }
        
        if (diasDevueltos > 0) {
            // 2. Fetch the debits for this request
            const qDebits = `SELECT idHistorial, diasSolicitados, diasDebitados, periodo FROM historial_vacaciones WHERE idSolicitud = ? AND tipoRegistro = 2 ORDER BY idHistorial DESC`;
            const resDebits = await Connection.execute(qDebits, [idSolicitud]);
            
            let remainingRefund = diasDevueltos;
            
            for (const row of resDebits.rows) {
                if (remainingRefund <= 0) break;
                
                // We can refund up to what was debited in this row
                const refundAmount = Math.min(remainingRefund, row.diasDebitados);
                
                if (refundAmount > 0) {
                    const qUpdateDebit = `UPDATE historial_vacaciones SET diasSolicitados = diasSolicitados - ?, diasDebitados = diasDebitados - ? WHERE idHistorial = ?`;
                    await Connection.execute(qUpdateDebit, [refundAmount, refundAmount, row.idHistorial]);
                    remainingRefund -= refundAmount;
                }
            }
        }
        
        // 3. Update status to 'cancelada' and store the reason
        const fechaResolucion = new Date().toISOString().split('T')[0];
        const qUpdateSol = `UPDATE solicitudes_vacaciones SET estadoSolicitud = 'cancelada', descripcionRechazo = ?, fechaResolucion = ? WHERE idSolicitud = ?`;
        const result = await Connection.execute(qUpdateSol, [motivo, fechaResolucion, idSolicitud]);

        // Registrar en bitácora
        await registrarBitacoraDao({
            idUsuario: idUsuarioSession || 1,
            usuario: usuarioSession || "Admin/RRHH",
            accion: 'UPDATE',
            tabla: 'solicitudes_vacaciones',
            idRegistroAfectado: idSolicitud,
            detallesAnteriores: { estadoSolicitud: 'autorizadas', cantidadDiasSolicitados: cantidadOriginal },
            detallesNuevos: { estadoSolicitud: 'cancelada', descripcionRechazo: motivo, fechaResolucion, diasGozados, diasDevueltos },
            descripcion: `Cancelación Parcial de vacaciones ID: ${idSolicitud}. Días gozados: ${diasGozados}, devueltos: ${diasDevueltos}. Motivo: ${motivo}`
        });

        return { success: true, diasDevueltos, diasGozados };
    }catch(error){
        console.log("Error en cancelarSolicitudParcialDao:", error);
        throw error;     
    }
}
