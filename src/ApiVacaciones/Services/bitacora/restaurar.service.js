import { BitacoraRestaurarDao } from "../../Dao/bitacora/restaurar.dao.js";

export const BitacoraRestaurarService = {
    restaurarRegistro: async (idBitacora) => {
        if (!idBitacora) throw new Error("ID de bitácora no proporcionado");
        return await BitacoraRestaurarDao.restaurarRegistro(idBitacora);
    }
};
