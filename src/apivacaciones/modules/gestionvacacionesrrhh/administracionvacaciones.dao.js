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

export const cancelarSolicitudParcialDao = async (idSolicitud, diasGozados, motivo, fechaReintegro, fechaFinCalculada, proximaFechaLaboralCalculada, idUsuarioSession, usuarioSession) => {
    try{
        // 1. Fetch the request to know the original days requested
        const qSol = `SELECT idEmpleado, idInfoPersonal, cantidadDiasSolicitados, fechaInicioVacaciones, fechaFinVacaciones FROM solicitudes_vacaciones WHERE idSolicitud = ? AND estadoSolicitud = 'autorizadas'`;
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
        
        // Only credit days if the request was ALREADY debited (tipoRegistro = 2 exists)
        const qCheckDebito = `SELECT * FROM historial_vacaciones WHERE idSolicitud = ? AND tipoRegistro = 2`;
        const resCheckDebito = await Connection.execute(qCheckDebito, [idSolicitud]);
        const wasDebited = resCheckDebito.rows.length > 0;

        if (diasDevueltos > 0 && wasDebited) {
            // 2. Fetch current diasDisponibles for the employee (last record)
            const qLastHistorial = `SELECT diasDisponibles FROM historial_vacaciones WHERE idEmpleado = ? ORDER BY idHistorial DESC LIMIT 1`;
            const resLastHistorial = await Connection.execute(qLastHistorial, [solicitud.idEmpleado]);
            
            let currentDiasDisponibles = 0;
            if (resLastHistorial.rows.length > 0) {
                currentDiasDisponibles = resLastHistorial.rows[0].diasDisponibles;
            }
            
            const newDiasDisponibles = currentDiasDisponibles + diasDevueltos;
            const fechaActual = new Date().toISOString().split('T')[0];
            const qInsertCredito = `
                INSERT INTO historial_vacaciones 
                (idEmpleado, idInfoPersonal, idSolicitud, periodo, diasAcreditados, diasDisponibles, fechaActualizacion, fechaAcreditacion, tipoRegistro, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'A')
            `;
            
            // Usamos el periodo del débito original para que el crédito quede en el mismo año fiscal
            // Esto evita que el cálculo de "consumidos" del año actual sea negativo
            const periodoDelDebito = resCheckDebito.rows[0].periodo || new Date().getFullYear().toString();
            
            await Connection.execute(qInsertCredito, [
                solicitud.idEmpleado,
                solicitud.idInfoPersonal,
                idSolicitud,
                periodoDelDebito,
                diasDevueltos, 
                newDiasDisponibles, // diasDisponibles acumulados
                fechaActual, // fechaActualizacion
                fechaActual // fechaAcreditacion
            ]);
        }
        
        // 3. Update status to 'cancelada', update requested days and reason
        // Nota: El usuario quiere actualizar "cantidadDiasSolicitados" al número real gozado
        const fechaResolucion = new Date().toISOString().split('T')[0];
        const qUpdateSol = `
            UPDATE solicitudes_vacaciones 
            SET estadoSolicitud = 'cancelada', 
                cantidadDiasSolicitados = ?,
                descripcionRechazo = ?, 
                fechaResolucion = ?,
                fechaFinVacaciones = ?,
                fechaRetornoLabores = ?
            WHERE idSolicitud = ?
        `;
        // Guardamos el motivo completo
        const motivoCompleto = fechaReintegro ? `${motivo} | Fecha Reintegro: ${fechaReintegro}` : motivo;
        await Connection.execute(qUpdateSol, [diasGozados, motivoCompleto, fechaResolucion, fechaFinCalculada, proximaFechaLaboralCalculada, idSolicitud]);

        // Registrar en bitácora
        await registrarBitacoraDao({
            idUsuario: idUsuarioSession || 1,
            usuario: usuarioSession || "Admin/RRHH",
            accion: 'UPDATE',
            tabla: 'solicitudes_vacaciones',
            idRegistroAfectado: idSolicitud,
            detallesAnteriores: { estadoSolicitud: 'autorizadas', cantidadDiasSolicitados: cantidadOriginal, fechaFinVacaciones: solicitud.fechaFinVacaciones },
            detallesNuevos: { estadoSolicitud: 'cancelada', descripcionRechazo: motivoCompleto, fechaResolucion, diasGozados, diasDevueltos, fechaFinVacaciones: fechaFinCalculada },
            descripcion: `Cancelación Parcial de vacaciones ID: ${idSolicitud}. Días gozados: ${diasGozados}, devueltos: ${diasDevueltos}. Motivo: ${motivoCompleto}`
        });

        return { success: true, diasDevueltos, diasGozados };
    }catch(error){
        console.log("Error en cancelarSolicitudParcialDao:", error);
        throw error;     
    }
}
