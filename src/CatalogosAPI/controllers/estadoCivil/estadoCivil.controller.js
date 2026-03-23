import { getEstadoCivilServices } from "../../services/estadocivil/estadocivil.services.js";


export const getestadoCivilController = async (req, res) =>{
    try{
        const [estadoCivil] = await getEstadoCivilServices();
        res.json({estadoCivil});
    }catch(error){
        return res.status(500).json({
            message: error
        });
    }
}
