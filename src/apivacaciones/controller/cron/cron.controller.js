import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { transporter, FROM_EMAIL } from "../../services/email/transporter.js";
import { PlantillaRecordatorioAnual } from "../../plantillascorreos/plantilas.js";

/**
 * Controlador CRON: Recordatorio Anual de Vacaciones
 * Vercel invoca este endpoint automáticamente el 2 de enero a las 8:00 AM (UTC).
 * Envía un correo masivo a todos los empleados activos recordándoles sus 20 días.
 */
export const recordatorioAnualController = async (req, res) => {
  try {
    // La verificación de CRON_SECRET ya la hace el middleware verifyCronSecret en la ruta.
    const anioActual = new Date().getFullYear();

    // Obtener todos los empleados activos con su correo y nombre
    const empleadosRes = await Connection.execute(`
      SELECT e.idEmpleado, 
             (inf.primerNombre || ' ' || IFNULL(inf.segundoNombre, '') || ' ' || inf.primerApellido || ' ' || IFNULL(inf.segundoApellido, '')) AS nombreCompleto,
             e.correoInstitucional
      FROM empleados e
      JOIN infoPersonalEmpleados inf ON e.idInfoPersonal = inf.idInfoPersonal
      WHERE e.estado = 'A' 
        AND e.correoInstitucional IS NOT NULL 
        AND e.correoInstitucional != ''
    `);

    const empleados = empleadosRes.rows;
    let enviados = 0;
    let errores = 0;

    console.log(`[CRON] 🌴 Iniciando recordatorio anual ${anioActual} para ${empleados.length} empleados...`);

    for (const emp of empleados) {
      try {
        const html = PlantillaRecordatorioAnual(emp.nombreCompleto.trim(), anioActual);
        
        await transporter.sendMail({
          from: `"Consejo Nacional de Adopciones" <${FROM_EMAIL}>`,
          to: emp.correoInstitucional,
          subject: `🌴 Recordatorio: Programa tus vacaciones ${anioActual} - CNA`,
          html,
        });

        enviados++;
        console.log(`[CRON] ✅ Enviado a: ${emp.correoInstitucional}`);

        // Pequeña pausa para no saturar Gmail (max ~500/día)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        errores++;
        console.error(`[CRON] ❌ Error enviando a ${emp.correoInstitucional}:`, err.message);
      }
    }

    const resumen = {
      anio: anioActual,
      totalEmpleados: empleados.length,
      correosenviados: enviados,
      errores,
      fecha: new Date().toISOString(),
    };

    console.log("[CRON] 📊 Resumen:", resumen);
    return res.status(200).json({ message: "Recordatorio anual ejecutado.", ...resumen });

  } catch (error) {
    console.error("[CRON] ❌ Error fatal en recordatorio anual:", error);
    return res.status(500).json({ message: "Error ejecutando recordatorio anual.", error: error.message });
  }
};
