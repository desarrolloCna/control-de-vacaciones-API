import { Connection } from "../connection/conexionsqlite.dao.js";

export const obtenerDatosDashboardDao = async () => {
    try {
        // Obtenemos los estados
        const estadosRes = await Connection.execute(`
            SELECT estadoSolicitud, COUNT(*) as cantidad
            FROM solicitudes_vacaciones
            GROUP BY estadoSolicitud
        `);
        const estadosData = estadosRes.rows;

        let distribucionEstados = {
            enviada: 0,
            autorizadas: 0,
            rechazada: 0,
            finalizadas: 0,
            reprogramacion: 0
        };

        let totalSolicitudes = 0;
        let totalAutorizadas = 0;

        estadosData.forEach(row => {
            const estado = (row.estadoSolicitud || 'desconocido').toLowerCase();
            if (distribucionEstados[estado] !== undefined) {
                distribucionEstados[estado] += row.cantidad;
            } else {
                distribucionEstados[estado] = row.cantidad;
            }
            totalSolicitudes += row.cantidad;

            if (estado === 'autorizadas' || estado === 'finalizadas') {
                totalAutorizadas += row.cantidad;
            }
        });

        const tasaAprobacion = totalSolicitudes > 0 
            ? Math.round((totalAutorizadas / totalSolicitudes) * 100) 
            : 0;

        // Promedio de días solicitados
        const promedioRes = await Connection.execute(`
            SELECT COALESCE(AVG(cantidadDiasSolicitados), 0) as promedio
            FROM solicitudes_vacaciones
        `);
        const promedioData = promedioRes.rows;

        const promedioDias = Math.round(Number(promedioData[0].promedio) * 10) / 10;

        return {
            distribucionEstados,
            kpis: {
                totalMes: totalSolicitudes, // Nota: esto muestra globalmente, si se añade filtro por fecha en el futuro se hace acá
                tasaAprobacion,
                promedioDias
            }
        };

    } catch (error) {
        console.error("Error en obtenerDatosDashboardDao:", error);
        throw error;
    }
};
