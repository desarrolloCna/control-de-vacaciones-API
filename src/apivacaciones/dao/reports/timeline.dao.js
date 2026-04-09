import { Connection } from "../connection/conexionsqlite.dao.js";

export const getTimelineEventosDao = async (idEmpleado) => {
    try {
        // Obtenemos Solicitudes (Vacaciones Tomadas/Aprobadas/Rechazadas)
        const querySolicitudes = `
            SELECT 
                'SOLICITUD' as tipoEvento,
                idSolicitud as idRelacionado,
                estadoSolicitud as estado,
                cantidadDiasSolicitados as cantidadDias,
                fechaInicioVacaciones as fechaExtra1,
                fechaFinVacaciones as fechaExtra2,
                fechaSolicitud as fechaEvento,
                correlativo,
                NULL as periodo
            FROM solicitudes_vacaciones
            WHERE idEmpleado = ?
        `;

        // Obtenemos Acreditaciones de dias (Historial de vacaciones cuando se otorgan días o ajustan)
        const queryAcreditaciones = `
            SELECT 
                'ACREDITACION' as tipoEvento,
                idHistorial as idRelacionado,
                'Acreditado' as estado,
                diasAcreditados as cantidadDias,
                NULL as fechaExtra1,
                NULL as fechaExtra2,
                fechaAcreditacion as fechaEvento,
                NULL as correlativo,
                periodo
            FROM historial_vacaciones
            WHERE idEmpleado = ? AND diasAcreditados > 0
        `;

        const resSolicitudes = await Connection.execute(querySolicitudes, [idEmpleado]);
        const resAcreditaciones = await Connection.execute(queryAcreditaciones, [idEmpleado]);

        // Unimos y ordenamos cronológicamente descendente
        const todos = [
            ...(resSolicitudes.rows || []),
            ...(resAcreditaciones.rows || [])
        ];

        todos.sort((a, b) => new Date(b.fechaEvento) - new Date(a.fechaEvento));

        return todos;

    } catch (error) {
        console.error("Error en getTimelineEventosDao:", error);
        throw error;
    }
};
