import { EnviarMailServices } from "./enviaremail.service.js";

export const EnviarCorreoElectronicoServices = async (data) => {
    try{
        const res = await EnviarMailServices(data);
        return res;
    }catch(error){
        throw error;
    }
}
