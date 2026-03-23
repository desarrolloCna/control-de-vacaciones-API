import { getCalendarioVacacionesService } from "../../Services/Calendario/Calendario.services.js";

/**
 * @swagger
 * /api/calendario/vacaciones:
 *   get:
 *     summary: Obtiene la lista global de vacaciones autorizadas para el calendario
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: []
 */
export const getCalendarioController = async (req, res) => {
  try {
    const { unidad, idRol, puesto } = req.query; // extraemos la unidad, Nivel de Autoridad y puesto
    const vacaciones = await getCalendarioVacacionesService(unidad, idRol, puesto);
    res.status(200).json({ status: 200, data: vacaciones });
  } catch (error) {
    const status = error?.codRes || 500;
    res.status(status).json({
      codErr: status,
      error: error?.message || "Error al obtener el calendario global",
    });
  }
};
