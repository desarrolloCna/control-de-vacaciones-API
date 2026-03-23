import { Connection } from "../connection/conexionsqlite.dao.js";

export const getNotificacionesByEmpleadoDao = async (idEmpleado) => {
  try {
    const query = `
      SELECT idNotificacion, titulo, mensaje, tipo, leida, fechaCreacion, enlace
      FROM notificaciones 
      WHERE idEmpleado = ?
      ORDER BY fechaCreacion DESC
      LIMIT 50;
    `;
    const result = await Connection.execute(query, [idEmpleado]);
    return result.rows || [];
  } catch (error) {
    throw error;
  }
};

export const crearNotificacionDao = async (data) => {
  try {
    const query = `
      INSERT INTO notificaciones (idEmpleado, titulo, mensaje, tipo, leida, enlace)
      VALUES (?, ?, ?, ?, 0, ?);
    `;
    const result = await Connection.execute(query, [
      data.idEmpleado,
      data.titulo || "Actualización de Perfil",
      data.mensaje,
      data.tipo || "sistema",
      data.enlace || null
    ]);
    return result.lastInsertRowid;
  } catch (error) {
    throw error;
  }
};

export const marcarNotificacionLeidaDao = async (idNotificacion, idEmpleado) => {
  try {
    const query = `
      UPDATE notificaciones 
      SET leida = 1 
      WHERE idNotificacion = ? AND idEmpleado = ?;
    `;
    const result = await Connection.execute(query, [idNotificacion, idEmpleado]);
    return result;
  } catch (error) {
    throw error;
  }
};
