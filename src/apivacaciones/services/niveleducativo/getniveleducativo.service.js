import { obtenerNivelEducativoInfoDao } from "../../dao/niveleducativo/getniveleducativo.dao.js";


export const obtenerNivelEducativoInfoSerices = async (idInfoPersonal) => {
    try{
          const nivelEducativoInf = await obtenerNivelEducativoInfoDao(idInfoPersonal);
          return nivelEducativoInf;
    }catch(error){
       throw error;
 
    }
  }
