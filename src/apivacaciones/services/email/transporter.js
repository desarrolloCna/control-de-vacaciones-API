import nodemailer from "nodemailer";
import "dotenv/config";

// ============================================================
// NODEMAILER + Gmail (App Password)
// Funciona tanto en local como en Vercel
// ============================================================

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Email remitente
export const FROM_EMAIL = process.env.GMAIL_USER || "cnadesarrollo@gmail.com";

// ============================================================
// MODO PRUEBAS: Interceptar correos para no enviarlos a usuarios reales
// ============================================================
const TEST_EMAIL = "jcurruchiche@cna.gob.gt";
const originalSendMail = transporter.sendMail.bind(transporter);

transporter.sendMail = async (mailOptions) => {
  // Guardamos la info original para los logs o para el subject
  const originalTo = mailOptions.to;
  const originalCc = mailOptions.cc;
  
  console.log(`[TEST MODE] Interceptando correo dirigido a: ${originalTo}`);
  
  // Modificamos el destinatario para que solo vaya al correo de pruebas
  mailOptions.to = TEST_EMAIL;
  if (mailOptions.cc) mailOptions.cc = TEST_EMAIL; // Si hay copias, redirigirlas también o eliminarlas
  if (mailOptions.bcc) mailOptions.bcc = TEST_EMAIL;
  
  // Agregar una advertencia en el asunto para que sepas a quién iba originalmente
  mailOptions.subject = `[PRUEBA - Iba para: ${originalTo}] ${mailOptions.subject}`;
  
  // Llamar a la función original de envío con los destinatarios modificados
  return originalSendMail(mailOptions);
};

// Diagnóstico
console.log("[GMAIL] Usuario:", process.env.GMAIL_USER || "⚠️ NO CONFIGURADO");
console.log("[GMAIL] App Password:", process.env.GMAIL_APP_PASSWORD ? "✅ Configurada" : "⚠️ NO CONFIGURADA");
console.log(`[TEST MODE] ⚠️ TODOS los correos serán enviados únicamente a: ${TEST_EMAIL}`);
