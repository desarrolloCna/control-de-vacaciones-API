import { obtenerDatosMedicoDao } from "../../dao/datosmedicos/getdatosmedicos.dao.js";

export const obtenerDatosMedicosServices = async (idInfoPersonal) => {
    try{
          const datosMedicos = await obtenerDatosMedicoDao(idInfoPersonal);
          return datosMedicos;
    }catch(error){
       throw error;
 
    }
  }
