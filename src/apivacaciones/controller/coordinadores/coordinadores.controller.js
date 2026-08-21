import { consultarCoordinadoresListService, consultarCoordinadorService, registrarCoordinadorServices, relevarCoordinadorServices } from "../../services/coordinadores/coordinadores.service.js";



export const registrarCoordinadorController = async (req, res) => {
    try{
        const idCoordinador = await registrarCoordinadorServices(req.body);
        const responseData = {
            status: 200,
            message: "Coordinador Ingresada correctamente",
            idCoordinador
        }
        res
        .status(200)
        .json({responseData});

    }catch(error){
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }

}

export const consultarCoordinadorController = async (req, res) => {
    const { unidad } = req.query;
    try {
        const coordinador = await consultarCoordinadorService(unidad);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            coordinador
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const consultarCoordinadoresListController = async (req, res) => {
    try {
        const coordinadores = await consultarCoordinadoresListService();
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            coordinadores
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}

export const relevarCoordinadorController = async (req, res) => {
    try {
        const { idEmpleadoSaliente, idEmpleadoEntrante } = req.body;
        
        if (!idEmpleadoSaliente || !idEmpleadoEntrante) {
            return res.status(400).json({ success: false, message: "idEmpleadoSaliente e idEmpleadoEntrante son requeridos" });
        }
        
        const result = await relevarCoordinadorServices(idEmpleadoSaliente, idEmpleadoEntrante);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en relevarCoordinadorController:", error);
        return res.status(500).json({ success: false, message: error.message || "Error al relevar coordinador" });
    }
}
