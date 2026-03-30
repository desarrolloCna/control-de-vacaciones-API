import { EnviarMailAutorizacionDeVacaciones } from "./src/apivacaciones/services/email/envioemailvacacionesautorizadas.service.js";
import { GenerarPlantillasCorreos } from "./src/apivacaciones/plantillascorreos/plantilas.js";

const testData = {
  correoPersonal: "cnadesarrollo@gmail.com",
  estadoSolicitud: "autorizadas",
  nombreCompleto: "Jorge Sistema Prueba",
  fechaInicioVacaciones: "2026-04-10",
  fechaFinVacaciones: "2026-04-15",
  cantidadDiasSolicitados: 5,
  idSolicitud: 9999
};

async function run() {
  console.log("Cargando plantilla...");
  const plantillaHtml = GenerarPlantillasCorreos("autorizacion-vacaciones", testData);
  console.log("Enviando correo...");
  const info = await EnviarMailAutorizacionDeVacaciones(testData, plantillaHtml, null);
  console.log("Resultado:", info);
}

run();
