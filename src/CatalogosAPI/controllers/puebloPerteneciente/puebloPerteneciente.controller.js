import { getPuebloPertenecienteServices } from "../../services/puebloperteneciente/puebloperteneciente.services.js";

export const getPuebloPertenecienteController = async (req, res) =>{
    try{
        const [etnias] = await getPuebloPertenecienteServices();
        res.json({etnias});
    }catch(error){
        return res.status(500).json({
            message: error
        });
    }
}
