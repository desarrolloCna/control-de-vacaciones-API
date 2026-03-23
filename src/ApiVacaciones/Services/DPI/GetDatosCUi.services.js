import { obtenerInfoDPIDao } from "../../dao/dpi/getdatoscui.dao.js";


export const obtenerInfoDPIServices = async (idDpi) => {
    try{
          const dpiData = await obtenerInfoDPIDao(idDpi);
          return dpiData;
    }catch(error){
       throw error;
 
    }
  }
