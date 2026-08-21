import { consultarCoordinadorDao, consultarCoordinadoresListDao, registrarCoordinadorDao, RelevarCoordinadorDao } from "../../dao/coordinadores/coordinadores.dao.js";



export const registrarCoordinadorServices = async (data) => {
    try{
          const coordinadorId = await registrarCoordinadorDao(data);
          return coordinadorId;
    }catch(error){
       throw error;
 
    }
  }

export const consultarCoordinadorService = async (idCoordinador) => {
    try{
          const coordinador = await consultarCoordinadorDao(idCoordinador);
          return coordinador;
    }catch(error){
       throw error;
 
    }
  }


  export const consultarCoordinadoresListService = async () => {
      try{
            const coordinador = await consultarCoordinadoresListDao();
            return coordinador;
      }catch(error){
         throw error;
   
      }
    }

export const relevarCoordinadorServices = async (idEmpleadoSaliente, idEmpleadoEntrante) => {
    try {
        const result = await RelevarCoordinadorDao(idEmpleadoSaliente, idEmpleadoEntrante);
        return result;
    } catch (error) {
        console.error("Error en relevarCoordinadorServices:", error);
        throw error;
    }
}
