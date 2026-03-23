import { consultarEmpleadosSinVacacionesDao, consultarEmpleadosUltimoAnioDao } from "../../dao/empleados/empleados.dao.js";
import { acreditarDiasPorPeriodoService } from "../vacationapp/hisotrialvacaciones/controldedias.service.js";
import { employeesListDao, obtenerDatosLaboralesDao } from "../../dao/empleados/getdataempleados.dao.js";

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

            const empleadosSinVacacionesCrudos = await consultarEmpleadosSinVacacionesDao();

            // Run JIT Accreditation for everyone returned so they match mathematically 
            // regardless of their last login (Ligia vs Brenner sync).
            const promesas = empleadosSinVacacionesCrudos.map(async (emp) => {
                  try {
                        const payloadData = {
                              idEmpleado: emp.idEmpleado,
                              idInfoPersonal: emp.idInfoPersonal,
                              fechaIngreso: emp.fechaIngreso
                        };
                        await acreditarDiasPorPeriodoService(payloadData);
                  } catch(e) {
                        console.error('Error nivelando silenciosamente empleado:', emp.Nombre, e);
                  }
            });

            await Promise.all(promesas);

            // Fetch again so the array contains the mathematically leveled 'diasTotales'
            const empleadosSinVacaciones = await consultarEmpleadosSinVacacionesDao();
            return empleadosSinVacaciones;

      }catch(error){
            throw error;
      }
}
