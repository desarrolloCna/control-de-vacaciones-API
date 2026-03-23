import { getDiasFestivosDao, createDiaFestivoDao, updateDiaFestivoDao, deleteDiaFestivoDao } from "../../dao/diasfestivos/diasfestivos.dao.js";


export const getDiasFestivosServices = async () => {
    try{
          const diasFestivos = await getDiasFestivosDao();
          return diasFestivos;
    }catch(error){
       throw error;
 
    }
  }

export const createDiaFestivoService = async (data) => {
    try {
        return await createDiaFestivoDao(data);
    } catch(error) {
        throw error;
    }
}

export const updateDiaFestivoService = async (id, data) => {
    try {
        return await updateDiaFestivoDao(id, data);
    } catch(error) {
        throw error;
    }
}

export const deleteDiaFestivoService = async (id) => {
    try {
        return await deleteDiaFestivoDao(id);
    } catch(error) {
        throw error;
    }
}
