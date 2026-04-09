import { getKioscoDatosDao } from "../../dao/kiosco/kiosco.dao.js";

export const obtenerDatosKioscoController = async (req, res) => {
    try {
        const datos = await getKioscoDatosDao();
        res.status(200).json({
            status: 200,
            message: "Datos de Kiosco obtenidos",
            data: datos
        });
    } catch (error) {
        console.error("Error en obtenerDatosKioscoController:", error);
        res.status(500).json({ error: "Error al recuperar datos para el kiosco" });
    }
};
