import { getRenglonesDao } from "../../dao/renglon/renglonpresupuestario.dao.js";


export const getRenglonesServices = async () =>{
    try{
       const religiones  = await getRenglonesDao();
       return religiones;
    }catch(error){
       return error;
    }
 }
