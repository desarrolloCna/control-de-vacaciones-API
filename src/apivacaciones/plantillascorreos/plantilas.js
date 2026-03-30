import { formatDateToDisplay } from "../services/utils/dateutils.js";

const plantillaAutorizacionDeVacaciones = (data) => {
    const estado = data?.estadoSolicitud?.toLowerCase() || "no especificado";
    const esAutorizada = estado === "autorizadas";
    const claseEstado =  esAutorizada ? "estado-autorizada" : "estado-rechazada";
    const estadoTexto = esAutorizada ? "AUTORIZADA" : "RECHAZADA";
    const colorPrimario = esAutorizada ? "#2e7d32" : "#d32f2f";

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notificación de Vacaciones - CNA</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); border: 1px solid #e0e0e0; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .content { padding: 35px 30px; line-height: 1.6; }
        .status-banner { text-align: center; padding: 15px; margin-bottom: 25px; border-radius: 8px; font-weight: bold; font-size: 18px; background-color: ${esAutorizada ? '#e8f5e9' : '#ffebee'}; color: ${colorPrimario}; border: 1px solid ${colorPrimario}; }
        .info-grid { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #eee; }
        .info-item { margin: 10px 0; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        .info-item:last-child { border-bottom: none; }
        .info-item strong { color: #555; }
        .footer { background-color: #f9f9f9; padding: 25px; text-align: center; color: #666; font-size: 13px; border-top: 1px solid #eee; }
        .contact { color: #4F46E5; font-weight: 600; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Consejo Nacional de Adopciones</h1>
        </div>
        <div class="content">
          <p>Estimado(a) <strong> ${data.nombreCompleto} </strong>,</p>
          <p>Le informamos sobre el estado oficial de su solicitud de vacaciones:</p>
          
          <div class="status-banner">
            SOLICITUD ${estadoTexto}
          </div>

          <div class="info-grid">
            <div class="info-item"><strong>Fecha de Inicio:</strong> <span>${formatDateToDisplay(data.fechaInicioVacaciones)}</span></div>
            <div class="info-item"><strong>Fecha de Fin:</strong> <span>${formatDateToDisplay(data.fechaFinVacaciones)}</span></div>
            <div class="info-item"><strong>Día de Reintegro:</strong> <span>${formatDateToDisplay(data.fechaRetornoLabores)}</span></div>
            <div class="info-item"><strong>Días Solicitados:</strong> <span>${data.cantidadDiasSolicitados}</span></div>
          </div>

          <p>Si tiene alguna duda o necesita asistencia adicional, por favor no dude en <strong>contactarse</strong> con su coordinador inmediato.</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático generado por el Sistema de Vacaciones.</p>
          <div class="contact">UTICS - Extensión 105</div>
          <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} Consejo Nacional de Adopciones</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

const PlantillaNotificacionSolicitudACoordinador = (data) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Solicitud de Vacaciones - CNA</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; color: #333; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 1px solid #e1e4e8; }
        .header { background: #1E293B; color: #ffffff; padding: 25px; text-align: center; }
        .header h2 { margin: 0; font-size: 20px; }
        .content { padding: 35px 30px; }
        .alert-box { background-color: #e3f2fd; border-left: 5px solid #1976D2; padding: 15px; margin-bottom: 25px; color: #0D47A1; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 15px; }
        table th { background-color: #f8f9fa; color: #555; text-align: left; padding: 12px; border: 1px solid #eee; width: 40%; }
        table td { padding: 12px; border: 1px solid #eee; color: #333; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { background-color: #0D47A1; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Gestión de Vacaciones - CNA</h2>
        </div>
        <div class="content">
          <p>Estimado(a) <strong>${data.nombreCoordinador}</strong>,</p>
          <div class="alert-box">
            Se ha registrado una nueva solicitud de vacaciones pendiente de su revisión.
          </div>
          <p><strong>Detalles del Empleado:</strong></p>
          <ul>
            <li>Nombre: ${data.nombreCompleto}</li>
            <li>Unidad: ${data.unidadSolicitud}</li>
          </ul>

          <p><strong>Detalle de la Solicitud:</strong></p>
          <table>
            <tr><th>Días Solicitados</th><td>${data.cantidadDiasSolicitados}</td></tr>
            <tr><th>Fecha de Inicio</th><td>${formatDateToDisplay(data.fechaInicioVacaciones)}</td></tr>
            <tr><th>Fecha de Fin</th><td>${formatDateToDisplay(data.fechaFinVacaciones)}</td></tr>
            <tr><th>Retorno a Labores</th><td>${formatDateToDisplay(data.fechaRetornoLabores)}</td></tr>
          </table>

          <p>Para gestionar esta solicitud, por favor ingrese al portal administrativo:</p>
          <div class="btn-container">
            <a href="https://control-de-vacaciones-front.vercel.app/" class="btn" style="background-color: #4F46E5;">Ir al Panel de Gestión</a>
          </div>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático generado por el Sistema de Control de Vacaciones del Consejo Nacional de Adopciones.</p>
          <p>UTICS - Extensión 105</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
};

export const GenerarPlantillasCorreos = (plantilla, data) => {
  switch (plantilla) {
    case "autorizacion-vacaciones":
      return plantillaAutorizacionDeVacaciones(data);
    case "solicitud-vacaciones":
        return PlantillaNotificacionSolicitudACoordinador(data);
    default:
      return "Opción inválida";
  }
};
