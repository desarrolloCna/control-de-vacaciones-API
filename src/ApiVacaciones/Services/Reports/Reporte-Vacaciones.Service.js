import { vacacionesReportDao } from "../../dao/reports/reporte-vacaciones.dao.js";

export const vacacionesReportService = async (unidad) => {
    try{
          const reporteVacaciones = await vacacionesReportDao(unidad);
          return reporteVacaciones;
    }catch(error){
       throw error;
 
    }
  }
