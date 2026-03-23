import { getDiasFestivosServices, createDiaFestivoService, updateDiaFestivoService, deleteDiaFestivoService } from "../../services/diasfestivos/diasfestivos.service.js";


export const getDiasFestivosController = async (req, res) => {
    try {
        const diasFestivos = await getDiasFestivosServices();
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            diasFestivos
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const createDiaFestivoController = async (req, res) => {
    try {
        const result = await createDiaFestivoService(req.body);
        const serializedResult = result ? { ...result, lastInsertRowid: result.lastInsertRowid ? result.lastInsertRowid.toString() : null } : null;
        res.status(201).json({ message: "Día festivo creado exitosamente", data: serializedResult });
    } catch (error) {
        console.error("DIAS FESTIVOS POST ERROR:", error);
        res.status(500).json({ error: error.message || "Error al crear" });
    }
}

export const updateDiaFestivoController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateDiaFestivoService(id, req.body);
        const serializedResult = result ? { ...result, lastInsertRowid: result.lastInsertRowid ? result.lastInsertRowid.toString() : null } : null;
        res.status(200).json({ message: "Día festivo actualizado exitosamente", data: serializedResult });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error al actualizar" });
    }
}

export const deleteDiaFestivoController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteDiaFestivoService(id);
        const serializedResult = result ? { ...result, lastInsertRowid: result.lastInsertRowid ? result.lastInsertRowid.toString() : null } : null;
        res.status(200).json({ message: "Día festivo eliminado exitosamente", data: serializedResult });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error al eliminar" });
    }
}
