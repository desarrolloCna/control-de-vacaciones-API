import { IngresarNivelEducativoDao } from "../../dao/niveleducativo/niveleducativo.dao.js";


export const IngresarNivelEducativoService = async (data) => {
    try{
          const result = await IngresarNivelEducativoDao(data);
          return result;
    }catch(error){
       throw error;
 
    }
  }
