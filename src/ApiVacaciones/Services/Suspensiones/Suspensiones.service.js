import { GetSuspensionesDao, ingresarSuspensionDao, darDeBajaEmpleadoDao } from "../../Dao/Suspensiones/Suspensiones.Dao.js";


export const GetSuspensionesServices = async () => {
    try{
          const suspensionesLaborales = await GetSuspensionesDao();
          return suspensionesLaborales;
    }catch(error){
       throw error;
 
    }
  }


export const ingresarSuspensionService = async (data) => {
    try{
          const idSuspension = await ingresarSuspensionDao(data);

          // Si es baja, desactivar al empleado y su usuario con registro en bitácora
          if (data.tipoSuspension === 'baja' && data.idEmpleado) {
              await darDeBajaEmpleadoDao(data.idEmpleado, { 
                  idUsuario: data.idUsuarioSession, 
                  usuario: data.usuarioSession 
              });
          }

          return idSuspension;
    }catch(error){
       throw error;
 
    }
  }