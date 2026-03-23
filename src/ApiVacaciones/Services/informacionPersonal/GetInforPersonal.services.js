import { obtenerInfoPersonalDao } from "../../dao/informacionpersonal/getinfopersonal.dao.js";



export const obtenerInfoPersonalServices = async (idInfoPersonal) => {
    try{
          const infoPersonal = await obtenerInfoPersonalDao(idInfoPersonal);
          return infoPersonal;
    }catch(error){
       throw error;
 
    }
  }
