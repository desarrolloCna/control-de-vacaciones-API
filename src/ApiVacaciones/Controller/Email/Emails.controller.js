import { EnviarCorreoElectronicoServices } from "../../Services/email/Emails.service.js";


export const enviarEmailController = async (req, res) => {
    try {
        const mail = await EnviarCorreoElectronicoServices(req.body);
        const responseData = {
            status: 200,
            message: "Data encontra correctamente",
            mail
        };
        res.status(200).json(responseData);
        
    }catch(error){
        const codRes = error?.codRes || 500;
        const responseData = error?.message || error;
        responseData.status;
        res.status(codRes).json({ responseData });
    }
}
