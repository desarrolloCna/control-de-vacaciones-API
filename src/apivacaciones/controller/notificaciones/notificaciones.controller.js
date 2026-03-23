import { 
  getNotificacionesService, 
  marcarLeidaService,
  crearNotificacionService
} from "../../services/notificaciones/notificaciones.services.js";

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtiene las notificaciones del empleado autenticado
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 */
export const getNotificacionesController = async (req, res) => {
  try {
    const { idEmpleado } = req.user; // Obtenido del authMiddleware
    if (!idEmpleado) {
      return res.status(401).json({ mensaje: "Token inválido o sin ID." });
    }
    const notificaciones = await getNotificacionesService(idEmpleado);
    
    res.status(200).json({ status: 200, notificaciones });
  } catch (error) {
    const status = error?.codRes || 500;
    res.status(status).json({
      codErr: status,
      error: error?.message || "Error al obtener notificaciones",
    });
  }
};

/**
 * @swagger
 * /api/notificaciones/{id}/leer:
 *   put:
 *     summary: Marca una notificación como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
export const marcarNotificacionLeidaController = async (req, res) => {
  try {
    const { idEmpleado } = req.user;
    const { idNotificacion } = req.params;
    
    await marcarLeidaService(idNotificacion, idEmpleado);
    
    res.status(200).json({ status: 200, message: "Notificación marcada como leída." });
  } catch (error) {
    const status = error?.codRes || 500;
    res.status(status).json({
      codErr: status,
      error: error?.message || "Error interno.",
    });
  }
};

export const crearNotificacionController = async (req, res) => {
  try {
    const data = req.body;
    const idNotificacion = await crearNotificacionService(data);
    res.status(201).json({ status: 201, message: "Notificación creada.", idNotificacion });
  } catch (error) {
    const status = error?.codRes || 500;
    res.status(status).json({
      codErr: status,
      error: error?.message || "Error al crear notificación",
    });
  }
};
