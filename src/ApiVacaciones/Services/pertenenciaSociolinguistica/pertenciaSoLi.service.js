import { IngresarPertenenciaSoLi } from "../../dao/pertenenciasociolinguistica/pertenenciasoli.dao.js";


export const IngresarPertenenciaSoLiServices = async (data) => {
    try{
          const result = await IngresarPertenenciaSoLi(data);
          return result;
    }catch(error){
       throw error;
 
    }
  }
