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
