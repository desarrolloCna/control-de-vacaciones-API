import { getTimelineEventosDao } from "../../dao/reports/timeline.dao.js";

export const getTimelineEmpleadoController = async (req, res) => {
    try {
        const { idEmpleado } = req.params;
        if (!idEmpleado) {
            return res.status(400).json({ error: "Falta el idEmpleado" });
        }
        
        const lineaDeTiempo = await getTimelineEventosDao(idEmpleado);
        return res.status(200).json({
            status: 200,
            message: "Línea de tiempo obtenida exitosamente",
            data: lineaDeTiempo
        });
    } catch (error) {
        console.error("Error en getTimelineEmpleadoController:", error);
        return res.status(500).json({ error: "Error al obtener la línea de tiempo" });
    }
};
