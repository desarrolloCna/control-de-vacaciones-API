import { obtenerPertenenciaSoliDao } from "../../dao/pertenenciasociolinguistica/getpertenenciasoli.dao.js";


export const obtenerPertenenciaSoliServices = async (idInfoPersonal) => {
    try{
          const infoSoli = await obtenerPertenenciaSoliDao(idInfoPersonal);
          return infoSoli;
    }catch(error){
       throw error;
 
    }
  }
