import { actualizarSaldoManualService, acreditarDiasPorPeriodoService, debitarDiasPorPeriodoService } from "../../../services/vacationapp/hisotrialvacaciones/controldedias.service.js";


export const acreditarDiasPorPeriodoController = async (req, res) => {
    try{
        const hitorialIngresados = await acreditarDiasPorPeriodoService(req.body);
        const responseData = {
            status: 200,
            message: "Historial ingresado correctamente",
            hitorialIngresados
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

export const debitarDiasPorPeriodoController = async (req, res) => {
    try{
        const hitorialIngresados = await debitarDiasPorPeriodoService(req.body);
        const responseData = {
            status: 200,
            message: "Historial ingresado correctamente",
            hitorialIngresados
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

export const actualizarSaldoManualController = async (req, res) => {
    try {
        const rowsAffected = await actualizarSaldoManualService(req.body);
        const responseData = {
            status: 200,
            message: "Saldo actualizado correctamente",
            rowsAffected
        };
        res.status(200).json(responseData);
    } catch (error) {
        const status = error?.codRes || 500;
        const responseData = error?.message || error;
        res.status(status).json({ responseData });
    }
};
