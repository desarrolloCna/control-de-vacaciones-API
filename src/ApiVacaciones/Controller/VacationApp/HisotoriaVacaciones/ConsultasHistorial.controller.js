import { consultarDiasDebitadosPorAnioServices, consultarDiasDisponiblesServices, obtenerHistorialPorEmpleadoService } from "../../../Services/VacationApp/HisotrialVacaciones/ConsultasHistorial.service.js";

export const obtenerHistorialPorEmpleadoController = async (req, res) => {
    const { idEmpleado } = req.query; 
    try {
        const historial = await obtenerHistorialPorEmpleadoService(idEmpleado);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            historial
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const consultarDiasDebitadosPorAnioController = async (req, res) => {
    try{
        const {idEmpleado, anio} = req.query;
        const diasDisponibles = await consultarDiasDebitadosPorAnioServices(idEmpleado, anio);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            diasDisponibles
        };
        res.status(200).json(responseData);
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const consultarDiasDisponiblesController = async (req, res) => {
    try{
        const {idEmpleado} = req.query;
        const diasDisponibles = await consultarDiasDisponiblesServices(idEmpleado);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            diasDisponibles
        };
        res.status(200).json(responseData);
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}
