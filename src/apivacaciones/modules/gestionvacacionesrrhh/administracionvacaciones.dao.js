import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { registrarBitacoraDao } from "../../dao/bitacora/bitacora.dao.js";
import { getDiasFestivosDao } from "../../dao/diasfestivos/diasfestivos.dao.js";
import { calcularRetornoYFestivosBackend } from "../../utils/dateutils.js";
import dayjs from "dayjs";

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

export const cancelarSolicitudAutorizadaDaDao = async (idSolicitud, fechaResolucion, motivoReprogramacion, diasADevolver, idUsuarioSession, usuarioSession) => {
    try{
        let nuevosDias = 0;
        let nuevaFechaFin = null;
        let nuevaFechaRetorno = null;
        let trackingMessage = null;

        // Obtain original request data for recalculation
        const reqQuery = `SELECT sv.fechaInicioVacaciones, sv.cantidadDiasSolicitados, sv.fechaRetornoLabores, sv.observaciones_rrhh, sv.idEmpleado, sv.idInfoPersonal
                          FROM solicitudes_vacaciones sv WHERE sv.idSolicitud = ?`;
        const reqResult = await Connection.execute(reqQuery, [idSolicitud]);
        const originalReq = reqResult.rows[0];

        if (diasADevolver > 0 && originalReq) {
            // Calculate new days
            nuevosDias = originalReq.cantidadDiasSolicitados - diasADevolver;
            
            if (nuevosDias > 0) {
                // CANCELACIÓN PARCIAL: Se gozaron algunos días, acreditar la diferencia
                const queryDebit = `SELECT idEmpleado, idInfoPersonal, periodo FROM historial_vacaciones WHERE idSolicitud = ? AND diasDebitados > 0 ORDER BY idHistorial DESC LIMIT 1`;
                const resultDebit = await Connection.execute(queryDebit, [idSolicitud]);
                
                if (resultDebit.rows.length > 0) {
                    const { idEmpleado, idInfoPersonal, periodo } = resultDebit.rows[0];
                    
                    const queryCurrentAvailable = `SELECT diasDisponibles FROM historial_vacaciones WHERE idEmpleado = ? AND periodo = ? ORDER BY idHistorial DESC LIMIT 1`;
                    const resultCurrent = await Connection.execute(queryCurrentAvailable, [idEmpleado, periodo]);
                    const currentAvailable = resultCurrent.rows.length > 0 ? resultCurrent.rows[0].diasDisponibles : 0;
                    
                    const newAvailable = currentAvailable + diasADevolver;
                    
                    const insertCredit = `INSERT INTO historial_vacaciones 
                        (idEmpleado, idInfoPersonal, idSolicitud, periodo, diasAcreditados, diasDisponibles, fechaActualizacion, tipoRegistro) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;
                    await Connection.execute(insertCredit, [idEmpleado, idInfoPersonal, idSolicitud, periodo, diasADevolver, newAvailable, fechaResolucion]);
                }

                // Recalculate dates
                const todosLosFestivos = await getDiasFestivosDao();
                const recalculado = calcularRetornoYFestivosBackend(originalReq.fechaInicioVacaciones, nuevosDias, todosLosFestivos);
                nuevaFechaFin = recalculado.fechaFin;
                nuevaFechaRetorno = recalculado.proximaFechaLaboral;
                
                let obs = originalReq.observaciones_rrhh || "";
                if (obs) obs += "\n";
                obs += `[${dayjs().format('DD/MM/YYYY HH:mm')}] Por cancelación parcial de URRHH, se redujeron los días solicitados de ${originalReq.cantidadDiasSolicitados} a ${nuevosDias}. La fecha de reincorporación se ajustó automáticamente del ${dayjs(originalReq.fechaRetornoLabores).format('DD/MM/YYYY')} al ${dayjs(nuevaFechaRetorno).format('DD/MM/YYYY')}.`;
                trackingMessage = obs;
            } else {
                // CANCELACIÓN TOTAL: El service ya limpió los débitos.
                // Insertamos un registro de log para dejar huella en el historial.
                const { idEmpleado, idInfoPersonal } = originalReq;
                
                // Buscar el periodo más antiguo con días disponibles
                const periodoQuery = `SELECT periodo, diasDisponibles FROM historial_vacaciones WHERE idEmpleado = ? ORDER BY idHistorial DESC LIMIT 1`;
                const periodoResult = await Connection.execute(periodoQuery, [idEmpleado]);
                
                if (periodoResult.rows.length > 0) {
                    const { periodo, diasDisponibles } = periodoResult.rows[0];
                    
                    const insertLog = `INSERT INTO historial_vacaciones 
                        (idEmpleado, idInfoPersonal, idSolicitud, periodo, diasAcreditados, diasDebitados, diasDisponibles, fechaActualizacion, tipoRegistro) 
                        VALUES (?, ?, ?, ?, 0, 0, ?, ?, 1)`;
                    await Connection.execute(insertLog, [idEmpleado, idInfoPersonal, idSolicitud, periodo, diasDisponibles, fechaResolucion]);
                }
            }
        }

        // 2. Update status to 'reprogramacion', store the reason, and updated dates if any
        if (nuevaFechaRetorno) {
            const query = `update solicitudes_vacaciones set estadoSolicitud = 'reprogramacion', 
                            descripcionRechazo = ?,                 
                            fechaResolucion = ?,
                            cantidadDiasSolicitados = ?,
                            fechaFinVacaciones = ?,
                            fechaRetornoLabores = ?,
                            observaciones_rrhh = ?
                            where idSolicitud = ?`;
            await Connection.execute(query, [
                motivoReprogramacion,
                fechaResolucion, 
                nuevosDias,
                nuevaFechaFin,
                nuevaFechaRetorno,
                trackingMessage,
                idSolicitud]);
        } else {
            const query = `update solicitudes_vacaciones set estadoSolicitud = 'reprogramacion', 
                            descripcionRechazo = ?,                 
                            fechaResolucion = ?
                            where idSolicitud = ?`;
            await Connection.execute(query, [
                motivoReprogramacion,
                fechaResolucion, 
                idSolicitud]);
        }

        // Registrar en bitácora
        await registrarBitacoraDao({
            idUsuario: idUsuarioSession || 1,
            usuario: usuarioSession || "Admin/RRHH",
            accion: 'UPDATE',
            tabla: 'solicitudes_vacaciones',
            idRegistroAfectado: idSolicitud,
            detallesAnteriores: { estadoSolicitud: 'autorizadas' },
            detallesNuevos: { estadoSolicitud: 'reprogramacion', descripcionRechazo: motivoReprogramacion, fechaResolucion, diasDevueltos: diasADevolver },
            descripcion: `Se canceló/reprogramó la solicitud ID: ${idSolicitud} por motivo: ${motivoReprogramacion}. Días devueltos: ${diasADevolver}`
        });

        return {
            nuevaFechaFin,
            nuevaFechaRetorno,
            nuevosDias
        };
    }catch(error){
        console.log("Error en cancelarSolicitudAutorizada:", error);
        throw error;     
    }
}
