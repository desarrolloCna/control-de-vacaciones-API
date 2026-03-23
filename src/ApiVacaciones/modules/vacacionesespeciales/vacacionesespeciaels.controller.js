import { consultarGestionVacacionesEspecialesService, registrarVacacionesEspecialesService, registrarExcepcionLimiteService, consultarExcepcionLimiteService } from "./vacacionesespeciales.service.js";

export const registrarVacacionesEspecialesController = async (req, res) => {
    try {
        const idVacacionesEspeciales = await registrarVacacionesEspecialesService(req.body);
        const responseData = {
            status: 200,
            message: "Datos ingresados correctamente",
            idVacacionesEspeciales
        };
        res.status(200).json(responseData);
        
    } catch (error) {
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }
}

export const consultarGestionVacacionesEspecialesController = async (req, res) => {
    const { idEmpleado, fechaEnCurso } = req.query;
    try {
        const vacacionesEspeciales = await consultarGestionVacacionesEspecialesService(idEmpleado, fechaEnCurso);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            vacacionesEspeciales
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const registrarExcepcionLimiteController = async (req, res) => {
    try {
        const idExcepcionLimite = await registrarExcepcionLimiteService(req.body);
        const responseData = {
            status: 200,
            message: "Datos ingresados correctamente",
            idExcepcionLimite
        };
        res.status(200).json(responseData);
        
    } catch (error) {
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }
}

export const consultarExcepcionLimiteController = async (req, res) => {
    const { idEmpleado, fechaEnCurso } = req.query;
    try {
        const excepcionLimite = await consultarExcepcionLimiteService(idEmpleado, fechaEnCurso);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            excepcionLimite
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}