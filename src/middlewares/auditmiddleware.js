import { registrarBitacoraDao } from "../apivacaciones/dao/bitacora/bitacora.dao.js";

/**
 * Middleware para auditar acciones automáticamente.
 * Intercepta la respuesta, y si es exitosa, guarda en la bitácora la acción
 * con el usuario que la ejecutó, la URL, y detalles en JSON.
 *
 * @param {string} accion - Nombre general de la acción (ej. "CANCELAR_SOLICITUD", "MODIFICAR_SALDO")
 */
export const auditMiddleware = (accion) => {
  return (req, res, next) => {
    // Solo si hay un usuario autenticado
    if (!req.user || !req.user.idUsuario) {
      return next();
    }

    // Guardar referencia al res.json original para interceptarlo
    const originalJson = res.json.bind(res);

    res.json = async (data) => {
      // Registrar logueo en la bitácora si la petición HTTP es exitosa o un 200/201 (es decir, todo salió bien)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          // Preparamos los detalles que guardaremos en formato JSON seguro
          const detallesAccion = JSON.stringify({
            endpoint: req.originalUrl,
            method: req.method,
            bodyRelevante: req.body,    // Para saber qué se mandó
            queryparams: req.query,
            ip: req.ip || req.connection.remoteAddress
          });

          await registrarBitacoraDao({
            idUsuario: req.user.idUsuario,
            usuario: req.user.usuario || "Sistema_Auto",
            accion: accion,
            tabla: "AUDITORIA_SISTEMA",
            descripcion: detallesAccion
          });
          
        } catch (error) {
          console.error("Error silencioso del auditMiddleware al guardar bitácora:", error);
        }
      }

      // Enviar la respuesta original al cliente
      return originalJson(data);
    };

    next();
  };
};
