import { obtenerFamiliaresDao } from "../../dao/familiares/getdatosfamiliares.dao.js";


export const obtenerFamiliaresService = async (idEmpleado) => {
    try{
          const familieares = await obtenerFamiliaresDao(idEmpleado);
          return familieares;
    }catch(error){
       throw error;
 
    }
}
