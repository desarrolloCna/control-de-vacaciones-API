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
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.correoPersonal,
      subject: `Vacaciones ${estadoTexto} - no-reply`,
      html: plantiila,
      attachments,
    });

    console.log("Correo de autorización enviado via Resend:", response);
    return response;
  } catch (error) {
    console.error("Error enviando correo de autorización via Resend:", error);
    return error;
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
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.correoCoordinador,
      subject: "Solicitud de vacaciones - no-reply",
      html: plantiila,
      attachments,
    });

    console.log("Correo de solicitud enviado via Resend:", response);
    return response;
  } catch (error) {
    console.error("Error enviando correo de solicitud via Resend:", error);
    return error;
  }
};
