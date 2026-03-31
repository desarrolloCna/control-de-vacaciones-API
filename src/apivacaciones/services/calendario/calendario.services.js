import { getVacacionesAutorizadasGlobalDao } from "../../dao/calendario/calendario.dao.js";

export const getCalendarioVacacionesService = async (unidad, idRol, puesto) => {
  try {
    return await getVacacionesAutorizadasGlobalDao(unidad, idRol, puesto);
  } catch (error) {
    throw { codRes: 500, message: error?.message || "Error al obtener datos del calendario global" };
  }
};
