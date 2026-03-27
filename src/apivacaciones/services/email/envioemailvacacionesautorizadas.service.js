import { resend, FROM_EMAIL } from "./transporter.js";

export const EnviarMailAutorizacionDeVacaciones = async (data, plantiila, bufferPDF) => {
  const estadoTexto = data.estadoSolicitud?.toLowerCase() === "autorizadas" ? "Autorizadas" : "Rechazadas";

  // Construir adjuntos solo si hay PDF
  const attachments = bufferPDF
    ? [
        {
          filename: `slvc_${data.idSolicitud}_solicitud_vacaciones.pdf`,
          content: bufferPDF.toString("base64"),
        },
      ]
    : [];

  try {
    console.log(`[EMAIL] Enviando correo autorización a: ${data.correoPersonal}, desde: ${FROM_EMAIL}`);
    
    const { data: responseData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.correoPersonal,
      subject: `Vacaciones ${estadoTexto} - no-reply`,
      html: plantiila,
      attachments,
    });

    if (error) {
      console.error("[EMAIL] ❌ Error de Resend:", JSON.stringify(error));
      return { error: error.message || "Error al enviar correo" };
    }

    console.log("[EMAIL] ✅ Correo enviado exitosamente. ID:", responseData?.id);
    return responseData;
  } catch (error) {
    console.error("[EMAIL] ❌ Excepción al enviar correo:", error);
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
          content: bufferPDF.toString("base64"),
        },
      ]
    : [];

  try {
    console.log(`[EMAIL] Enviando correo solicitud a: ${data.correoCoordinador}, desde: ${FROM_EMAIL}`);
    
    const { data: responseData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.correoCoordinador,
      subject: "Solicitud de vacaciones - no-reply",
      html: plantiila,
      attachments,
    });

    if (error) {
      console.error("[EMAIL] ❌ Error de Resend:", JSON.stringify(error));
      return { error: error.message || "Error al enviar correo" };
    }

    console.log("[EMAIL] ✅ Correo enviado exitosamente. ID:", responseData?.id);
    return responseData;
  } catch (error) {
    console.error("[EMAIL] ❌ Excepción al enviar correo:", error);
    return { error: error.message || "Error inesperado" };
  }
};
