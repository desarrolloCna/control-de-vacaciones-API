import { IngresarInfoPersonalDao } from "../../dao/informacionpersonal/infopersonalemple.dao.js";


export const IngresarInfoPersonalService = async (data) => {
    try{
          const result = await IngresarInfoPersonalDao(data);
          return result;
    }catch(error){
       throw error;
 
    }
  }
