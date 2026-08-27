import { cancelarSolicitudAutorizadaService, consultarSolicitudesVacacionesAutorizadasService } from "./administracionvacaciones.service.js";

export const consultarSolicitudesVacacionesAutorizadasController = async (req, res) => {
    try {
        const solicitudes = await consultarSolicitudesVacacionesAutorizadasService();
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            solicitudes
        };
        res.status(200).json(responseData);
        
    } catch (error) {
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }
}

export const cancelarSolicitudAutorizadaController = async (req, res) => {
    try {
        const { idSolicitud, fechaResolucion, motivoReprogramacion, idUsuarioSession, usuarioSession } = req.body;
        const result = await cancelarSolicitudAutorizadaService(idSolicitud, fechaResolucion, motivoReprogramacion, idUsuarioSession, usuarioSession);
        const responseData = {
            status: 200,
            message: "Solicitud cancelada correctamente",
            result
        };
        res.status(200).json(responseData);
        
    } catch (error) {
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }
}

