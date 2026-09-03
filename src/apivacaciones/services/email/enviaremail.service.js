import { transporter, FROM_EMAIL } from "./transporter.js";

export const EnviarMailServices = async (data) => {
  try {
    const info = await transporter.sendMail({
      from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
      to: data.correo,
      subject: "Credenciales de Acceso - Consejo Nacional de Adopciones",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background-color: #1a1a2e; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: #d4913a; margin: 0;">Consejo Nacional de Adopciones</h2>
            <p style="color: #fff; margin: 5px 0 0 0; font-size: 13px;">Sistema de Control de Vacaciones</p>
          </div>
          <div style="padding: 30px 20px;">
            <p style="color: #333;">Estimado/a <strong>${data.nombre}</strong>,</p>
            <p style="color: #555;">Se ha generado una contraseña temporal para su cuenta. Por favor, úsela para iniciar sesión y cámbiela de inmediato.</p>
            <div style="background-color: #f5f5f5; border-left: 4px solid #d4913a; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 5px 0;"><strong>Usuario:</strong> <span style="font-family: monospace; color: #1a1a2e;">${data.user}</span></p>
              <p style="margin: 5px 0;"><strong>Contraseña temporal:</strong> <span style="font-family: monospace; color: #d4913a; font-size: 18px;">${data.pass}</span></p>
            </div>
            <p style="color: #e53935; font-size: 13px;">⚠️ Esta contraseña expira al primer uso. El sistema le pedirá crear una nueva contraseña al ingresar.</p>
            <p style="color: #555; font-size: 13px;">Si usted no solicitó este cambio, contacte a Recursos Humanos de inmediato.</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Consejo Nacional de Adopciones - Guatemala</p>
          </div>
        </div>
      `
    });

    console.log(`[EMAIL] ✅ Correo enviado. MessageId: ${info.messageId}`);
    return { messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL] ❌ Error enviando correo de credenciales:", error);
    throw error;
  }
};
