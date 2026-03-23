import { 
  getNotificacionesByEmpleadoDao, 
  marcarNotificacionLeidaDao,
  crearNotificacionDao
} from "../../Dao/Notificaciones/Notificaciones.dao.js";

export const getNotificacionesService = async (idEmpleado) => {
  if (!idEmpleado) {
    throw { codRes: 400, message: "ID del empleado es requerido." };
  }
  return await getNotificacionesByEmpleadoDao(idEmpleado);
};

export const marcarLeidaService = async (idNotificacion, idEmpleado) => {
  if (!idNotificacion || !idEmpleado) {
    throw { codRes: 400, message: "Faltan parámetros de notificación y empleado." };
  }
  return await marcarNotificacionLeidaDao(idNotificacion, idEmpleado);
};

export const crearNotificacionService = async (data) => {
  if (!data.idEmpleado || !data.mensaje) {
    throw { codRes: 400, message: "Faltan datos obligatorios para la notificación." };
  }
  return await crearNotificacionDao(data);
};
