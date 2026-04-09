import { GenerarPlantillasCorreos } from "../../../plantillascorreos/plantilas.js";
import { EnviarMailSolicitudDeVacaciones, EnviarMailConfirmacionEmpleado } from "../../email/envioemailvacacionesautorizadas.service.js";
import { generateVacationRequestPDF } from "../../pdfgenerator/pdfgenerator.service.js";
import { consultarCoordinadorService } from "../../coordinadores/coordinadores.service.js";
import { getSolicitudesByIdSolcitudDao } from "../../../dao/vacationapp/getsolicitudbyid.dao.js";
import { consultarPeriodosYDiasPorEmpeladoDao } from "../../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import { obtenerPeriodosParaVacaciones } from "../../vacationapp/hisotrialvacaciones/calculodedias.service.js";

export const notificarSolicitudVacacionesIngresada = async (data) => {
  try {
    //Consultar Coordinador
    const coordinador = await consultarCoordinadorService(data.idCoordinador);

    //Consultar datos del empleado desde la solicitud ingresada
    const infoEmpleado = await getSolicitudesByIdSolcitudDao(data.idSolicitud,data.idEmpleado);

    //Integrar datos genereales de la solcitud
    const dataSolicitud = { ...data, ...coordinador, ...infoEmpleado };

    //Generar plantilla para el envio de correo
    const plantillaHtml = GenerarPlantillasCorreos("solicitud-vacaciones",dataSolicitud);

    //Generar pdf de la autorizacion
    const periodos = await consultarPeriodosYDiasPorEmpeladoDao(data.idEmpleado);
    const diasPorPeriodo = obtenerPeriodosParaVacaciones(periodos, dataSolicitud.cantidadDiasSolicitados);
    const bufferPDF = await generateVacationRequestPDF(dataSolicitud,diasPorPeriodo);

    //Envio de correo solicitud a coordinador
    await EnviarMailSolicitudDeVacaciones(
      dataSolicitud,
      plantillaHtml,
      bufferPDF
    );

    //Generar plantilla y Enviar confirmacion al Empleado
    if (infoEmpleado && infoEmpleado.correoInstitucional) {
      const plantillaHtmlEmpleado = GenerarPlantillasCorreos("confirmacion-empleado", dataSolicitud);
      await EnviarMailConfirmacionEmpleado(dataSolicitud, plantillaHtmlEmpleado);
    }

  } catch (error) {
    throw error;
  }
};
