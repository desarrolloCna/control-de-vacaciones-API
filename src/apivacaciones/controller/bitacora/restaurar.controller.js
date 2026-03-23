import { BitacoraRestaurarService } from "../../services/bitacora/restaurar.service.js";

export const BitacoraRestaurarController = {
    restaurarRegistro: async (req, res) => {
        try {
            const { idBitacora } = req.body;
            const result = await BitacoraRestaurarService.restaurarRegistro(idBitacora);
            res.json({ 
                message: "Registro restaurado exitosamente", 
                detalles: result.entry.descripcion 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
