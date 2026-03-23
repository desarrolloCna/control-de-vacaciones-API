import { getLoginDataDao } from "../../dao/login/login.dao.js";


export const loginServices = async (data) => {
    try{
        const userData = await getLoginDataDao(data);
        return userData;

    }catch(error){
        throw error;
    }

}
