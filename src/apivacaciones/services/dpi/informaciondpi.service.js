import { IngresarInformacionDpiDao } from "../../dao/dpi/infodpi.dao.js";

export const IngresarInfoDpiServices = async (data) => {
    try{
          const result = await IngresarInformacionDpiDao(data);
          return result;
    }catch(error){
       throw error;
 
    }
  }
