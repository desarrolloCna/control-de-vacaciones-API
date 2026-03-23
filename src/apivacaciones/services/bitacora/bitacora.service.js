import { registrarBitacoraDao, obtenerBitacoraDao } from "../../dao/bitacora/bitacora.dao.js";

export const registrarBitacoraService = async (data) => {
    try {
        return await registrarBitacoraDao(data);
    } catch (error) {
        throw error;
    }
};

export const obtenerBitacoraService = async (filtros) => {
    try {
        return await obtenerBitacoraDao(filtros);
    } catch (error) {
        throw error;
    }
};
