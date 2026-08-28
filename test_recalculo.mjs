import { Connection } from "./src/apivacaciones/dao/connection/conexionsqlite.dao.js";
import { recalcularSolicitudesPorNuevoFestivo } from "./src/apivacaciones/services/diasfestivos/recalculo.service.js";
import "dotenv/config";

async function run() {
  await recalcularSolicitudesPorNuevoFestivo({ fechaDiaFestivo: "2026-08-31", descripcion: "Prueba Festivo" });
  console.log("Script ejecutado.");
  process.exit(0);
}
run();
