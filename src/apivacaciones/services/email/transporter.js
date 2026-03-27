import { Resend } from "resend";
import "dotenv/config";

// ============================================================
// RESEND (Para producción en Vercel - usa HTTP, no SMTP)
// ============================================================
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email remitente (usar onboarding@resend.dev en plan gratuito)
export const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

// ============================================================
// NODEMAILER (Para pruebas locales - usa SMTP, NO funciona en Vercel)
// Descomentar las líneas de abajo si necesitas probar en localhost
// ============================================================
// import nodemailer from "nodemailer";
// export const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "gestionesrrhhiga@gmail.com",
//       pass: "puxxrvicwdybfgkd",
//     },
//   });
