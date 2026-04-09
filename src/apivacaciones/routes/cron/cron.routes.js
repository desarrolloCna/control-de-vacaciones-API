import { Router } from "express";
import { recordatorioAnualController } from "../../controller/cron/cron.controller.js";

const cronRoute = Router();

// Esta ruta NO requiere autenticación JWT porque es invocada por Vercel Cron
// La seguridad se maneja internamente con CRON_SECRET
cronRoute.get("/cron/recordatorio-anual", recordatorioAnualController);

export { cronRoute };
