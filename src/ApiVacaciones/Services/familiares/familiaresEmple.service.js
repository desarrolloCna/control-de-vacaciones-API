import { IngresarFamiliarDao } from "../../dao/familiares/familiaresemple.dao.js";


export const IngresarFamiliarService = async (data) => {
    try{
          const result = await IngresarFamiliarDao(data);
          return result;
    }catch(error){
       throw error;
 
    }
  }
