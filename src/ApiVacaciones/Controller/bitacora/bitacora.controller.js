import { registrarBitacoraService, obtenerBitacoraService } from "../../Services/bitacora/bitacora.service.js";

export const registrarBitacoraController = async (req, res) => {
    try {
        const data = req.body;
        console.log("Registrando bitácora:", data);
        await registrarBitacoraService(data);
        res.status(201).json({ message: "Registro de bitácora creado." });
    } catch (error) {
        console.error("Error en registrarBitacoraController:", error);
        res.status(500).json({ error: "Error al registrar en bitácora." });
    }
};

export const obtenerBitacoraController = async (req, res) => {
    try {
        const filtros = {
            fechaInicio: req.query.fechaInicio || null,
            fechaFin: req.query.fechaFin || null,
            usuario: req.query.usuario || null,
            tabla: req.query.tabla || null,
            accion: req.query.accion || null,
        };
        console.log("Consultando bitácora con filtros:", filtros);
        const bitacora = await obtenerBitacoraService(filtros);
        console.log(`Bitácora obtenida: ${bitacora?.length || 0} registros`);
        res.status(200).json({ bitacora });
    } catch (error) {
        console.error("Error en obtenerBitacoraController:", error);
        res.status(500).json({ error: "Error al obtener bitácora." });
    }
};
