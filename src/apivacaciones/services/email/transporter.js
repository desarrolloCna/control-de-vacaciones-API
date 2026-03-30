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

// Diagnóstico
console.log("[GMAIL] Usuario:", process.env.GMAIL_USER || "⚠️ NO CONFIGURADO");
console.log("[GMAIL] App Password:", process.env.GMAIL_APP_PASSWORD ? "✅ Configurada" : "⚠️ NO CONFIGURADA");
