import { transporter, FROM_EMAIL } from "./transporter.js";

export const EnviarMailAutorizacionDeVacaciones = async (data, plantiila, bufferPDF) => {
  const estadoTexto = data.estadoSolicitud?.toLowerCase() === "autorizadas" ? "Autorizadas" : "Rechazadas";

  // Construir adjuntos solo si hay PDF
  const attachments = bufferPDF
    ? [
        {
          filename: `slvc_${data.idSolicitud}_solicitud_vacaciones.pdf`,
          content: bufferPDF,
        },
      ]
    : [];

  try {
    console.log(`[EMAIL] Enviando correo autorización a: ${data.correoInstitucional}, desde: ${FROM_EMAIL}`);

    const info = await transporter.sendMail({
      from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
      to: data.correoInstitucional,
      subject: `Vacaciones ${estadoTexto} - no-reply`,
      html: plantiila,
      attachments,
    });

    console.log("[EMAIL] ✅ Correo enviado exitosamente. ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("[EMAIL] ❌ Error al enviar correo:", error);
    return { error: error.message || "Error inesperado" };
  }
};

export const EnviarMailSolicitudDeVacaciones = async (
  data,
  plantiila,
  bufferPDF
) => {
  // Construir adjuntos
  const attachments = bufferPDF
    ? [
        {
          filename: `slvc_${data.idSolicitud}_solicitud_vacaciones.pdf`,
          content: bufferPDF,
        },
      ]
    : [];

  try {
    console.log(`[EMAIL] Enviando correo solicitud a: ${data.correoCoordinador}, desde: ${FROM_EMAIL}`);

    const info = await transporter.sendMail({
      from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
      to: data.correoCoordinador,
      subject: "Solicitud de vacaciones - no-reply",
      html: plantiila,
      attachments,
    });

    console.log("[EMAIL] ✅ Correo enviado exitosamente. ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("[EMAIL] ❌ Error al enviar correo:", error);
    return { error: error.message || "Error inesperado" };
  }
};

export const EnviarMailConfirmacionEmpleado = async (data, plantiila) => {
  try {
    console.log(`[EMAIL] Enviando correo de confirmación a: ${data.correoInstitucional}`);
    const info = await transporter.sendMail({
      from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
      to: data.correoInstitucional,
      subject: "Confirmación de Solicitud Recibida - no-reply",
      html: plantiila,
    });
    console.log("[EMAIL] ✅ Correo de confirmación enviado exitosamente.");
    return info;
  } catch (error) {
    console.error("[EMAIL] ❌ Error al enviar correo de confirmación:", error);
    return { error: error.message };
  }
};
