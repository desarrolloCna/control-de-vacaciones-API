import { transporter, FROM_EMAIL } from "./transporter.js";

export const EnviarMailServices = async (data) => {
  try {
    // 🔴 MODO PRUEBAS: NO ENVIAR CORREOS
    // Se comenta la lógica de envío real y solo se imprime en consola
    /*
    const info = await transporter.sendMail({
      from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
      to: data.correo,
      subject: "Credenciales de Acceso - Consejo Nacional de Adopciones",
      html: `...html omitido...`
    });
    */
    
    console.log("[EMAIL - MODO PRUEBAS] 🛑 ENVÍO DESHABILITADO");
    console.log(`[EMAIL - MODO PRUEBAS] Se iba a enviar correo a: ${data.correo}`);
    console.log(`[EMAIL - MODO PRUEBAS] Usuario: ${data.user}, Pass: ${data.pass}`);
    
    return { messageId: "modo-pruebas-sin-envio" };
  } catch (error) {
    console.error("[EMAIL] ❌ Error enviando correo de credenciales:", error);
    return error;
  }
};
