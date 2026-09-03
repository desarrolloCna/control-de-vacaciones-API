import {
  getSolicitudesByIdDao,
  getSolicitudesByIdSolcitudDao,
  consultarDiasEnTransitoDao,
} from "../../dao/vacationapp/getsolicitudbyid.dao.js";
import { consultarPeriodosYDiasPorEmpeladoDao } from "../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import {
  actualizarEstadoSolicitudDao,
  eliminarSolicitudDao,
  IngresarSolicitudDao,
} from "../../dao/vacationapp/modificarsolicitud.dao.js";
import { GenerarPlantillasCorreos } from "../../plantillascorreos/plantilas.js";
import { consultarCoordinadorService } from "../coordinadores/coordinadores.service.js";
import { EnviarMailAutorizacionDeVacaciones } from "../email/envioemailvacacionesautorizadas.service.js";
import dayjs from "dayjs";
import { consultarGestionVacacionesEspecialesDao, marcarExcepcionComoUsadaDao, consultarExcepcionLimiteDao } from "../../modules/vacacionesespeciales/vacacionesespeciales.dao.js";
import {
  obtenerPeriodosParaVacaciones,
  restarDiasEnTransito,
} from "./hisotrialvacaciones/calculodedias.service.js";
import { generateVacationRequestPDF } from "../pdfgenerator/pdfgenerator.service.js";
import { crearNotificacionDao } from "../../dao/notificaciones/notificaciones.dao.js";
import { notificarSolicitudVacacionesIngresada } from "../serviciosgenerales/enviodecorreos/notificaciones.service.js";

export const IngresarSolicitudService = async (data) => {
  try {
    // Validar límite de 20 días
    if (data.cantidadDiasSolicitados > 20) {
      const excepcion = await consultarExcepcionLimiteDao(data.idEmpleado, dayjs().format("YYYY-MM-DD"));
      if (!excepcion || excepcion.isExist === 0) {
        throw new Error("No tienes una excepción habilitada para solicitar más de 20 días.");
      }
    }
    //Consultar si exite una solicitud activa
    const solicitud = await getSolicitudesByIdDao(data.idEmpleado, data.idInfoPersonal);

    //Si existe una solicitud activa se elimina (Solo puede haber una solicitud activa)
    if (solicitud && solicitud.idSolicitud) {
      await eliminarSolicitudDao(solicitud.idSolicitud);
    }

    // Se ingresa la solicitud
    const idSolicitud = await IngresarSolicitudDao(data);
    data.idSolicitud = idSolicitud;

    // Si se usaron más de 20 días, invalidar la excepción (marcarla como usada)
    if (data.cantidadDiasSolicitados > 20) {
      try {
        await marcarExcepcionComoUsadaDao(data.idEmpleado, dayjs().format("YYYY-MM-DD"));
      } catch (e) {
        console.log("Error al marcar excepcion como usada:", e.message);
      }
    }

    try {
      await crearNotificacionDao({
        idEmpleado: data.idEmpleado, 
        titulo: "Solicitud Enviada 📤", 
        mensaje: "Tu solicitud fue enviada correctamente a tu Coordinador.", 
        tipo: "nueva_solicitud", 
        enlace: "/empleados/programar-vacaciones"
      });

      // Notificar al coordinador via campanita In-App
      const solicitudDB = await getSolicitudesByIdSolcitudDao(idSolicitud, data.idEmpleado);
      if (solicitudDB && solicitudDB.idCoordinador) {
        const coordinadorInfo = await consultarCoordinadorService(solicitudDB.idCoordinador);
        if (coordinadorInfo && coordinadorInfo.idEMpleado) {
          await crearNotificacionDao({
            idEmpleado: coordinadorInfo.idEMpleado, 
            titulo: "Nueva Solicitud Recibida 📬", 
            mensaje: "Tienes una solicitud de vacaciones de " + solicitudDB.nombreCompleto + " pendiente de autorizar.", 
            tipo: "nueva_solicitud", 
            enlace: "/activar-vacaciones"
          });
        }
      }
    } catch (err) { console.log("Error creando notificacion al ingresar:", err.message); }

    // Notificar de la solicitud ingresada via Correo al coordinador de la unidad
    await notificarSolicitudVacacionesIngresada(data);

    return idSolicitud;
  } catch (error) {

    if (error.codRes === 409) {
      const idSolicitud = await IngresarSolicitudDao(data);
      data.idSolicitud = idSolicitud;

      if (data.cantidadDiasSolicitados > 20) {
        try {
          await marcarExcepcionComoUsadaDao(data.idEmpleado, dayjs().format("YYYY-MM-DD"));
        } catch (e) {
          console.log("Error al marcar excepcion como usada (409):", e.message);
        }
      }

      // Reintentar notificacion In-App al coordinador
      try {
        const solicitudDB = await getSolicitudesByIdSolcitudDao(idSolicitud, data.idEmpleado);
        if (solicitudDB && solicitudDB.idCoordinador) {
          const coordinadorInfo = await consultarCoordinadorService(solicitudDB.idCoordinador);
          if (coordinadorInfo && coordinadorInfo.idEMpleado) {
            await crearNotificacionDao({
              idEmpleado: coordinadorInfo.idEMpleado,
              titulo: "Nueva Solicitud Recibida 📬",
              mensaje: "Tienes una solicitud de vacaciones de " + solicitudDB.nombreCompleto + " pendiente de autorizar.",
              tipo: "nueva_solicitud",
              enlace: "/activar-vacaciones"
            });
          }
        }
      } catch (notifErr) { console.log("Error notificacion coordinador (409):", notifErr.message); }

      // Notificar de la solicitud ingresada via Correo al coordinador de la unidad
      await notificarSolicitudVacacionesIngresada(data);
      
      return idSolicitud;
    }
    throw error; // Mantener el throw para que el error se propague
  }

};

export const actualizarEstadoSolicitudService = async (data) => {
  let bufferPDF = null;

  try {

    //Autoriza la solicitud ingresada
    const result = await actualizarEstadoSolicitudDao(data);

    // Crear notificación In-App
    let tituloNotif = "Estado de Solicitud";
    let mensajeNotif = `Tu solicitud ha cambiado al estado: ${data.estadoSolicitud}`;
    if (data.estadoSolicitud === "autorizadas") {
      tituloNotif = "Vacaciones Aprobadas 🎉";
      mensajeNotif = "Tu solicitud de vacaciones ha sido autorizada y procesada.";
    } else if (data.estadoSolicitud === "rechazada") {
      tituloNotif = "Vacaciones Rechazadas ❌";
      mensajeNotif = "Tu solicitud de vacaciones no pudo ser autorizada en este momento.";
    } else if (data.estadoSolicitud === "aceptadas" || data.estadoSolicitud === "aceptada") {
      tituloNotif = "Solicitud Aceptada ✅";
      mensajeNotif = "Tu Jefe/Coordinador ha aceptado tu solicitud. Ahora está pendiente de autorización por RRHH.";
    }
    // No bloqueamos el flujo si la notificación falla
    try {
      await crearNotificacionDao({
        idEmpleado: data.idEmpleado, 
        titulo: tituloNotif, 
        mensaje: mensajeNotif, 
        tipo: "cambio_estado", 
        enlace: "/empleados/programar-vacaciones"
      });
    } catch (err) {
      console.log("Error creando notificacion in-app:", err.message);
    }

    //Consulta de informacion de solicitud actualizar
    const solicitud = await getSolicitudesByIdSolcitudDao(data.idSolicitud,data.idEmpleado);
  
    //Consultar Datos coordinador
    const coordinador = await consultarCoordinadorService(solicitud.idCoordinador);

    // Integrar datos priorizando la información de la base de datos sobre el payload
    const solicitudCompleta = {...data, ...coordinador, ...solicitud};

    try {
      // Notificar al coordinador de su acción
      if (coordinador && coordinador.idEMpleado) {
        await crearNotificacionDao({
          idEmpleado: coordinador.idEMpleado, 
          titulo: data.estadoSolicitud === "autorizadas" ? "Solicitud Autorizada ✅" : "Solicitud Rechazada ❌", 
          mensaje: `Has ${data.estadoSolicitud} la solicitud de vacaciones exitosamente.`, 
          tipo: "cambio_estado", 
          enlace: "/activar-vacaciones"
        });
      }
    } catch (err) { console.log("Error creando notificacion in-app a coordinador:", err.message); }

    //Generar pdf de la autorizacion
    if(data.estadoSolicitud === "autorizadas"){
      const anioActual = dayjs().year();
      const fechaActual = dayjs().format("YYYY-MM-DD");
      let excluirAnioActual = anioActual;
      
      const permiso = await consultarGestionVacacionesEspecialesDao(data.idEmpleado, fechaActual);
      if (permiso && permiso.isExist > 0) {
          excluirAnioActual = null;
      }
      
      let periodos = await consultarPeriodosYDiasPorEmpeladoDao(data.idEmpleado, excluirAnioActual);
      
      // Restar días en tránsito de solicitudes más antiguas que aún no se han debitado
      const diasEnTransito = await consultarDiasEnTransitoDao(data.idEmpleado, data.idSolicitud);
      if (diasEnTransito > 0) {
          periodos = restarDiasEnTransito(periodos, diasEnTransito);
      }
      
      const diasPorPeriodo = obtenerPeriodosParaVacaciones(periodos, solicitud.cantidadDiasSolicitados);
      bufferPDF = await generateVacationRequestPDF(solicitudCompleta,diasPorPeriodo);
    }
    
    //Generar plantilla html para envio de correo.
    const plantillaHtml = GenerarPlantillasCorreos("autorizacion-vacaciones", solicitudCompleta);

    //Envio de correo solicitud autorizada
    await EnviarMailAutorizacionDeVacaciones(solicitudCompleta, plantillaHtml, bufferPDF);

    return result;
  } catch (error) {
    throw error; // Mantener el throw para que el error se propague
  }
};
