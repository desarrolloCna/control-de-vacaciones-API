import { Router } from "express";
import { recordatorioAnualController } from "../../controller/cron/cron.controller.js";
import { backupDatabaseController } from "../../controller/cron/backup.controller.js";

const cronRoute = Router();

// Esta ruta NO requiere autenticación JWT porque es invocada por Vercel Cron
// La seguridad se maneja internamente con CRON_SECRET (para Vercel Pro) o está abierta si es Free
cronRoute.get("/cron/recordatorio-anual", recordatorioAnualController);
cronRoute.get("/cron/backup-db", backupDatabaseController);

export { cronRoute };
