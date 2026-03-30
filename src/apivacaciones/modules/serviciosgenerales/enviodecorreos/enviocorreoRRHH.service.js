import { transporter } from "../../../config/nodemailer.config.js";
import { Connection } from "../../../dao/connection/conexionsqlite.dao.js";
import { PlantillaNotificacionReprogramacionRRHH } from "../../../plantillascorreos/plantilas.js";
import dotenv from "dotenv";

dotenv.config();

const FROM_EMAIL = process.env.GMAIL_USER || "gestionesrrhhiga@gmail.com";

export const EnviarMailReprogramacionRRHH = async (idSolicitud, motivoReprogramacion) => {
  try {
    // Buscar la información del solicitante
    const query = `
      SELECT 
        sl.idSolicitud, 
        (inf.primerNombre || ' ' || inf.primerApellido) AS nombreCompleto, 
        emp.correoInstitucional,
        sl.fechaInicioVacaciones, 
        sl.fechaFinVacaciones
      FROM solicitudes_vacaciones sl
      JOIN infoPersonalEmpleados inf ON sl.idInfoPersonal = inf.idInfoPersonal
      JOIN empleados emp ON sl.idEmpleado = emp.idEmpleado
      WHERE sl.idSolicitud = ?;
    `;
    const result = await Connection.execute(query, [idSolicitud]);
    
    if (!result.rows || result.rows.length === 0) {
      console.log(`[EMAIL] No se encontró la solicitud ${idSolicitud} para envío de reprogramación.`);
      return;
    }

    const { nombreCompleto, correoInstitucional, fechaInicioVacaciones, fechaFinVacaciones } = result.rows[0];

    if (!correoInstitucional) {
      console.log(`[EMAIL] El usuario ${nombreCompleto} no cuenta con correoInstitucional registrado.`);
      return;
    }

    // Preparar el HTML
    const plantiila = PlantillaNotificacionReprogramacionRRHH(nombreCompleto, fechaInicioVacaciones, fechaFinVacaciones, motivoReprogramacion);

    console.log(`[EMAIL] Enviando correo reprogramación a: ${correoInstitucional}, desde: ${FROM_EMAIL}`);

    const info = await transporter.sendMail({
      from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
      to: correoInstitucional,
      subject: `AVISO URGENTE: Reprogramación de Vacaciones - no-reply`,
      html: plantiila
    });

    console.log("[EMAIL] Correo de Reprogramación enviado exitosamente:", info.messageId);
    return true;

  } catch (error) {
    console.error("[EMAIL] Error al enviar correo de Reprogramación:", error);
    // Lanzar el error permitiría frenar el flujo, pero para correos solemos solo loggear.
  }
};
