import { consultarEmpleadosSinVacacionesDao, consultarEmpleadosUltimoAnioDao } from "../../Dao/empleados/empleados.dao.js";
import { employeesListDao, obtenerDatosLaboralesDao } from "../../Dao/empleados/GetDataEmpleados.dao.js";

export const employeesListServices = async () => {
    try{
          const emplloyeesList = await employeesListDao();
          return emplloyeesList;
    }catch(error){
       throw error;
 
    }
  }

export const obtenerDatosLaboralesServices = async (idInfoPersonal) => {
      try{
            const datosLaborales = await obtenerDatosLaboralesDao(idInfoPersonal);
            return datosLaborales;
      }catch(error){
         throw error;
   
      }
    }

export const consultarEmpleadosUltimoAnioServices = async (idEmpleado) => {
    try{
          const empleadosUltimoAnio = await consultarEmpleadosUltimoAnioDao(idEmpleado);
          return empleadosUltimoAnio;
    }catch(error){
       throw error;
 
    }
}

export const consultarEmpleadosSinVacacionesServices = async () => {
      try{

            const empleadosSinVacaciones = await consultarEmpleadosSinVacacionesDao();
            return empleadosSinVacaciones;

      }catch(error){
            throw error;
      }
}