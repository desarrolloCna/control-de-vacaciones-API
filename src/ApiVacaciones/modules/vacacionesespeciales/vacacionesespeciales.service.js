import { consultarGestionVacacionesEspecialesDao, registrarVacacionesEspecialesDao, consultarExcepcionLimiteDao, registrarExcepcionLimiteDao } from "./vacacionesespeciales.dao.js";

export const registrarVacacionesEspecialesService = async (data) => {
    try {
        const result = await registrarVacacionesEspecialesDao(data);
        return result;
    } catch (error) {
        console.log("Error en registrarVacacionesEspecialesService:", error);
        throw error;
    }
}

export const consultarGestionVacacionesEspecialesService = async (idEmpleado, fechaEnCurso) => {
    try{
        const result = await consultarGestionVacacionesEspecialesDao(idEmpleado, fechaEnCurso);
        return result;
    }catch(error){
        console.log("Error en consultarGestionVacacionesEspecialesService:", error);
        throw error;
    }
}

export const registrarExcepcionLimiteService = async (data) => {
    try {
        const result = await registrarExcepcionLimiteDao(data);
        return result;
    } catch (error) {
        console.log("Error en registrarExcepcionLimiteService:", error);
        throw error;
    }
}

export const consultarExcepcionLimiteService = async (idEmpleado, fechaEnCurso) => {
    try {
        const result = await consultarExcepcionLimiteDao(idEmpleado, fechaEnCurso);
        return result;
    } catch (error) {
        console.log("Error en consultarExcepcionLimiteService:", error);
        throw error;
    }
}