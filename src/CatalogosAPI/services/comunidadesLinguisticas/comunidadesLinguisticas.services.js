import { getComunidadLinguisticaDao } from "../../dao/comunidadlinguistica/comunidadlinguistica.dao.js";


export const getComunidadesLinguisticasServices = async () =>{
    try{
       const comunidadesLinguisticas  = await getComunidadLinguisticaDao();
       return comunidadesLinguisticas;
    }catch(error){
       return error;
    }
 }
