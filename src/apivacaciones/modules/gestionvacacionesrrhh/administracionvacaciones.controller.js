import { cancelarSolicitudAutorizadaService, consultarSolicitudesVacacionesAutorizadasService, consultarSolicitudesReprogramadasService, cancelarSolicitudParcialService, consultarSolicitudesCanceladasService } from "./administracionvacaciones.service.js";

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

export const consultarSolicitudesReprogramadasController = async (req, res) => {
    try {
        const solicitudes = await consultarSolicitudesReprogramadasService();
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

export const cancelarSolicitudParcialController = async (req, res) => {
    try {
        const { idSolicitud, diasGozados, motivo, idUsuarioSession, usuarioSession } = req.body;
        const result = await cancelarSolicitudParcialService(idSolicitud, diasGozados, motivo, idUsuarioSession, usuarioSession);
        const responseData = {
            status: 200,
            message: "Cancelación parcial registrada correctamente",
            result
        };
        res.status(200).json(responseData);
        
    } catch (error) {
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }
}

export const consultarSolicitudesCanceladasController = async (req, res) => {
    try {
        const solicitudes = await consultarSolicitudesCanceladasService();
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
