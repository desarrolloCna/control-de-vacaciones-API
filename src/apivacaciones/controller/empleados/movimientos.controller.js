import { procesarSucesionPuestoService, procesarBajaEmpleadoService } from "../../services/empleados/movimientos.service.js";

export const procesarSucesionPuestoController = async (req, res) => {
    try {
        const { idEmpleado, idInfoPersonal, puestoNuevo, fechaIngresoPuestoNuevo, motivo } = req.body;
        
        if (!idEmpleado || !idInfoPersonal || !puestoNuevo || !fechaIngresoPuestoNuevo || !motivo) {
            return res.status(400).json({ error: "Faltan datos obligatorios para la sucesión de puesto." });
        }

        const result = await procesarSucesionPuestoService(idEmpleado, idInfoPersonal, puestoNuevo, fechaIngresoPuestoNuevo, motivo);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en procesarSucesionPuestoController:", error);
        return res.status(500).json({ error: "Ocurrió un error al procesar la sucesión de puesto." });
    }
};

export const procesarBajaEmpleadoController = async (req, res) => {
    try {
        const { idEmpleado, fechaBaja, motivoBaja } = req.body;
        
        if (!idEmpleado || !fechaBaja || !motivoBaja) {
            return res.status(400).json({ error: "Faltan datos obligatorios para registrar la baja." });
        }

        const result = await procesarBajaEmpleadoService(idEmpleado, fechaBaja, motivoBaja);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en procesarBajaEmpleadoController:", error);
        return res.status(500).json({ error: "Ocurrió un error al procesar la baja del empleado." });
    }
};
