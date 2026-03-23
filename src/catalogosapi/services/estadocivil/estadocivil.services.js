import { getEstadoCivilDao } from "../../dao/estadoscivil/estadoscivil.dao.js";



export const getEstadoCivilServices = async () =>{
    try{
       const estadoCivil  = await getEstadoCivilDao();
       return estadoCivil;
    }catch(error){
       return error;
    }
 }
