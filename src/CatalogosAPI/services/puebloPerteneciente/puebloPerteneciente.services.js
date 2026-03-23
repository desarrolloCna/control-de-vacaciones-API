import { getPuebloPertenecienteDao } from "../../dao/puebloperteneciente/pueblosperteneciente.js";

export const getPuebloPertenecienteServices = async () =>{
    try{
       const puebloPerteneciente  = await getPuebloPertenecienteDao();
       return puebloPerteneciente;
    }catch(error){
       return error;
    }
 }
