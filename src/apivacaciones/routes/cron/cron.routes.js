import { Router } from "express";
import { recordatorioAnualController } from "../../controller/cron/cron.controller.js";
import { backupDatabaseController } from "../../controller/cron/backup.controller.js";
import { verifyCronSecret } from "../../../middlewares/verifycronsecret.js";

const cronRoute = Router();

// Estas rutas NO requieren JWT de usuario porque las invoca Vercel Cron.
// Se protegen con CRON_SECRET (ver src/middlewares/verifycronsecret.js).
cronRoute.get("/cron/recordatorio-anual", verifyCronSecret, recordatorioAnualController);
cronRoute.get("/cron/backup-db", verifyCronSecret, backupDatabaseController);

export { cronRoute };
