import nodemailer from "nodemailer";

export const EnviarMailServices = async (data) => {
  // Configuración del transporter (puedes ajustar esto según tus necesidades)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gestionesrrhhiga@gmail.com",
      pass: "puxxrvicwdybfgkd",
    },
  });

  // Detalles del correo electrónico
  const mailOptions = {
    from: "gestionesrrhhiga@gmail.com",
    to: data.correo,
    subject: "Credenciales de Acceso - Consejo Nacional de Adopciones",
    html: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Consejo Nacional de Adopciones</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 1px solid #e1e4e8; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%); color: #ffffff; padding: 35px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content p { margin-bottom: 20px; }
        .credentials-box { background-color: #f8f9fa; border: 1px dashed #4F46E5; border-radius: 8px; padding: 25px; margin: 25px 0; }
        .credentials-item { margin: 10px 0; font-size: 16px; }
        .credentials-item strong { color: #4F46E5; min-width: 140px; display: inline-block; }
        .highlight { color: #d32f2f; font-weight: bold; }
        .footer { background-color: #f8f9fa; padding: 25px; text-align: center; color: #666666; font-size: 13px; border-top: 1px solid #eeeeee; }
        .contact-info { margin-top: 15px; padding-top: 15px; border-top: 1px solid #dddddd; color: #4F46E5; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Consejo Nacional de Adopciones</h1>
        </div>
        <div class="content">
          <p>Estimado(a) <strong>${data.nombre || 'Colaborador'}</strong>,</p>
          <p>Se han generado nuevas credenciales de acceso para su cuenta en el <strong>Sistema de Control de Vacaciones</strong>. Por favor, utilice los siguientes datos para ingresar:</p>
          
          <div class="credentials-box">
            <div class="credentials-item"><strong>Usuario:</strong> ${data.user}</div>
            <div class="credentials-item"><strong>Contraseña Temporal:</strong> <span class="highlight">${data.pass}</span></div>
          </div>
          
          <p>⚠️ <strong>Nota Importante:</strong> Por motivos de seguridad, el sistema le solicitará cambiar esta contraseña temporal por una personal la primera vez que inicie sesión.</p>
          
          <p>Si no ha solicitado este cambio, por favor ignore este mensaje o comuníquese con el departamento correspondiente.</p>
        </div>
        <div class="footer">
          <p>Este es un correo automático, por favor no responda a esta dirección.</p>
          <div class="contact-info">
            Cualquier duda comunicarse con UTICS ext. 105
          </div>
          <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Consejo Nacional de Adopciones</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  // Enviar el correo electrónico
  try{
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado: " + info.response);
    return info.response;
  }catch(error){
    console.error(error);
    return error;
  }
}