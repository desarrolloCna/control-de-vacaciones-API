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

export const PlantillaNotificacionConfirmacionEmpleado = (data) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Solicitud - CNA</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; color: #333; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 1px solid #e1e4e8; }
        .header { background: #059669; color: #ffffff; padding: 25px; text-align: center; }
        .header h2 { margin: 0; font-size: 20px; }
        .content { padding: 35px 30px; }
        .alert-box { background-color: #ecfdf5; border-left: 5px solid #10b981; padding: 15px; margin-bottom: 25px; color: #047857; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 15px; }
        table th { background-color: #f8f9fa; color: #555; text-align: left; padding: 12px; border: 1px solid #eee; width: 40%; }
        table td { padding: 12px; border: 1px solid #eee; color: #333; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Gestión de Vacaciones - CNA</h2>
        </div>
        <div class="content">
          <p>Estimado(a) <strong>${data.nombreCompleto}</strong>,</p>
          <div class="alert-box">
            Confirmamos que su solicitud ha sido recibida exitosamente en el sistema.
          </div>
          <p>La solicitud ha sido enviada automáticamente a su coordinador <strong>(${data.nombreCoordinador || 'Jefatura'})</strong> para su respectiva autorización.</p>
          <p><strong>Resumen de los días solicitados:</strong></p>
          <table>
            <tr><th>Cantidad Solicitada</th><td>${data.cantidadDiasSolicitados} días</td></tr>
            <tr><th>Inicio</th><td>${formatDateToDisplay(data.fechaInicioVacaciones)}</td></tr>
            <tr><th>Fin</th><td>${formatDateToDisplay(data.fechaFinVacaciones)}</td></tr>
          </table>
          <p>Recibirá un correo notificando en cuanto su solicitud sea aprobada o rechazada.</p>
        </div>
        <div class="footer">
          <p>UTICS - Extensión 105</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const GenerarPlantillasCorreos = (plantilla, data) => {
  switch (plantilla) {
    case "autorizacion-vacaciones":
      return plantillaAutorizacionDeVacaciones(data);
    case "solicitud-vacaciones":
        return PlantillaNotificacionSolicitudACoordinador(data);
    case "confirmacion-empleado":
        return PlantillaNotificacionConfirmacionEmpleado(data);
    default:
      return "Opción inválida";
  }
};

export const PlantillaNotificacionReprogramacionRRHH = (nombreCompleto, fechaInicioVacaciones, fechaFinVacaciones, motivoReprogramacion) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; color: #1f2937; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background-color: #EF4444; color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; }
        .content h2 { margin-top: 0; color: #111827; font-size: 20px; text-align: center; }
        .greeting { font-size: 16px; margin-bottom: 20px; }
        .info-card { background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 6px; padding: 20px; margin-bottom: 30px; }
        .info-item { margin-bottom: 15px; }
        .info-item:last-child { margin-bottom: 0; }
        .info-label { font-size: 14px; font-weight: 600; color: #EF4444; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { font-size: 16px; font-weight: 500; color: #111827; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AVISO URGENTE ⚠️</h1>
        </div>
        <div class="content">
          <h2>Reprogramación de Vacaciones</h2>
          <p class="greeting">Estimado(a) <strong>${nombreCompleto}</strong>,</p>
          <p>La unidad de Recursos Humanos ha requerido que tus vacaciones aprobadas del periodo <strong>${fechaInicioVacaciones} al ${fechaFinVacaciones}</strong> sean devueltas al estatus de Reprogramación de Vacaciones.</p>
          
          <div class="info-card">
            <div class="info-item">
              <div class="info-label">Motivo de Reprogramación:</div>
              <div class="info-value" style="font-style: italic;">"${motivoReprogramacion}"</div>
            </div>
          </div>
          <p>Tus días debitados regresarán a tu saldo. Por favor, comunícate con tu jefatura inmediata o directamente con la Unidad de Recursos Humanos para mayor información.</p>
        </div>
        <div class="footer">
          <p>Generado automáticamente por el Sistema de Control de Vacaciones del Consejo Nacional de Adopciones.</p>
          <p>UTICS - Extensión 105</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return html;
};

export const PlantillaRecordatorioAnual = (nombreCompleto, anio) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recordatorio de Vacaciones ${anio} - CNA</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; color: #333; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 1px solid #e1e4e8; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 35px 30px; line-height: 1.7; }
        .highlight-box { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-left: 5px solid #10B981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .highlight-box strong { color: #047857; font-size: 18px; }
        .steps { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .steps ol { margin: 0; padding-left: 20px; }
        .steps li { margin-bottom: 10px; }
        .btn-container { text-align: center; margin: 25px 0; }
        .btn { background: linear-gradient(135deg, #4F46E5, #3730A3); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; }
        .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 6px; margin: 20px 0; color: #92400E; }
        .footer { background-color: #f9f9f9; padding: 25px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌴 ¡Feliz Año Nuevo ${anio}!</h1>
          <p>Consejo Nacional de Adopciones - Unidad de Recursos Humanos</p>
        </div>
        <div class="content">
          <p>Estimado(a) <strong>${nombreCompleto}</strong>,</p>
          <p>Le deseamos un excelente inicio de año. Le recordamos que, de conformidad con el <strong>Artículo 50 del Reglamento de Trabajo Interno</strong>, usted tiene derecho al goce de vacaciones durante el presente año.</p>

          <div class="highlight-box">
            <strong>📅 Usted tiene derecho a 20 días hábiles de vacaciones en ${anio}.</strong>
            <p style="margin: 10px 0 0; color: #065f46;">Le solicitamos programar sus vacaciones lo antes posible para garantizar la continuidad operativa de su unidad.</p>
          </div>

          <div class="steps">
            <p style="font-weight: 700; margin-top: 0;">¿Cómo programar sus vacaciones?</p>
            <ol>
              <li>Ingrese al <strong>Portal de Vacaciones</strong> con sus credenciales.</li>
              <li>Diríjase a la sección <strong>"Programar Vacaciones"</strong>.</li>
              <li>Seleccione las fechas de su conveniencia.</li>
              <li>Su coordinador(a) recibirá la solicitud para su autorización.</li>
            </ol>
          </div>

          <div class="btn-container">
            <a href="https://control-de-vacaciones-front.vercel.app/" class="btn">Ir al Portal de Vacaciones</a>
          </div>

          <div class="warning">
            <strong>⚠️ Importante:</strong> Le instamos a no dejar por vencido el uso de sus vacaciones. La programación temprana facilita la planificación institucional y asegura el bienestar de todos los colaboradores.
          </div>

          <p>Si tiene dudas sobre su saldo de días, puede consultarlo directamente en el portal o comunicarse con la Unidad de Recursos Humanos.</p>
        </div>
        <div class="footer">
          <p>Este es un mensaje automático generado por el Sistema de Control de Vacaciones.</p>
          <p><strong>UTICS - Extensión 105</strong></p>
          <p>&copy; ${anio} Consejo Nacional de Adopciones</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
