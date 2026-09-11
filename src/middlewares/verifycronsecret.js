/**
 * Middleware para proteger endpoints de CRON (invocados por Vercel Cron, sin JWT de usuario).
 * Vercel envía automáticamente "Authorization: Bearer $CRON_SECRET" cuando la variable de
 * entorno CRON_SECRET está configurada en el proyecto. Aquí se exige de forma estricta:
 * en producción, si CRON_SECRET no está configurado, se bloquea el acceso (fail-closed)
 * en lugar de dejar el endpoint abierto.
 */
export const verifyCronSecret = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[CRON] CRON_SECRET no está configurado en producción. Bloqueando ejecución.");
    return res.status(503).json({ message: "CRON no configurado correctamente." });
  }

  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ message: "No autorizado para ejecutar este CRON." });
  }

  next();
};
