import { getJerarquiaUnidadesService } from "../../services/unidades/unidades.service.js";

export const getJerarquiaUnidadesController = async (req, res) => {
    try {
        const jerarquia = await getJerarquiaUnidadesService();
        res.status(200).json(jerarquia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
