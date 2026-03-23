import { IngresarDatosMedicosDao } from "../../dao/datosmedicos/datosmedicos.dao.js";


export const IngresarDatosMedicosServices = async (data) => {
    try{
          const result = await IngresarDatosMedicosDao(data);
          return result;
    }catch(error){
       throw error;
 
    }
  }
