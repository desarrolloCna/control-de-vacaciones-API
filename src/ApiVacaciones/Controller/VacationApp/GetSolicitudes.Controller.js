import { consultarDiasSolicitadosPorAnioServices, getSolicitudesServices } from "../../Services/VacationApp/GetSolicitudes.service.js";

export const getSolicitudesController = async (req, res) => {
    const { idCoordinador } = req.query; 
    try {
        const solicitudes = await getSolicitudesServices(idCoordinador);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            solicitudes
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const consultarDiasSolicitadosPorAnioController = async (req, res) => {
  const { idEmpleado, anio } = req.query;
  try {
    const diasSolicitados = await consultarDiasSolicitadosPorAnioServices(idEmpleado, anio);
    const responseData = {
        status: 200,
        message: "Data encontra correctamente",
        diasSolicitados
    };
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}