import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { getDiasFestivosServices } from "./diasfestivos.service.js";
import { getSolicitudesByIdSolcitudDao } from "../../dao/vacationapp/getsolicitudbyid.dao.js";
import { transporter, FROM_EMAIL } from "../email/transporter.js";
import { calcularRetornoYFestivosBackend } from "../../utils/dateutils.js";

dayjs.extend(isSameOrAfter);

// Utilidad local para Backend extraída a dateutils.js

export const recalcularSolicitudesPorNuevoFestivo = async (nuevoFestivoData) => {
    try {
        console.log("=== INICIANDO RECALCULO POR NUEVO FESTIVO ===");
        console.log("Festivo agregado:", nuevoFestivoData.fechaDiaFestivo);

        const fechaFestivo = dayjs(nuevoFestivoData.fechaDiaFestivo).format("YYYY-MM-DD");
        
        // 1. Obtener todos los festivos (incluido el recién creado)
        const todosLosFestivos = await getDiasFestivosServices();

        // 2. Buscar solicitudes que cruzan con este festivo
        const querySol = `
            SELECT * FROM solicitudes_vacaciones 
            WHERE estado = 'A' 
              AND estadoSolicitud IN ('enviada', 'autorizadas')
              AND fechaInicioVacaciones <= ?
              AND fechaRetornoLabores >= ?
        `;
        const resultSol = await Connection.execute(querySol, [fechaFestivo, fechaFestivo]);
        const solicitudesAfectadas = resultSol.rows;

        console.log(`Solicitudes afectadas encontradas: ${solicitudesAfectadas.length}`);

        for (const sol of solicitudesAfectadas) {
            console.log(`Procesando solicitud ${sol.idSolicitud}...`);
            const { fechaFin, proximaFechaLaboral } = calcularRetornoYFestivosBackend(
                sol.fechaInicioVacaciones, 
                sol.cantidadDiasSolicitados, 
                todosLosFestivos
            );

            // Si la fecha de retorno cambió debido al festivo extra
            if (proximaFechaLaboral !== sol.fechaRetornoLabores) {
                console.log(`Cambio detectado para sol ${sol.idSolicitud}: viejo retorno ${sol.fechaRetornoLabores}, nuevo ${proximaFechaLaboral}`);
                
                let nuevasObs = sol.observaciones_rrhh || "";
                if (nuevasObs) nuevasObs += "\n";
                nuevasObs += `[${dayjs().format('DD/MM/YYYY HH:mm')}] Se detectó un nuevo día festivo (${nuevoFestivoData.nombreDiaFestivo}) que no contemplaba la solicitud original. La fecha de reincorporación se ajustó automáticamente del ${dayjs(sol.fechaRetornoLabores).format('DD/MM/YYYY')} al ${dayjs(proximaFechaLaboral).format('DD/MM/YYYY')}.`;


                // Actualizar la solicitud
                await Connection.execute(`
                    UPDATE solicitudes_vacaciones 
                    SET fechaFinVacaciones = ?, fechaRetornoLabores = ?, observaciones_rrhh = ?
                    WHERE idSolicitud = ?
                `, [fechaFin, proximaFechaLaboral, nuevasObs, sol.idSolicitud]);

                // Nota: Los días debitados siguen siendo "cantidadDiasSolicitados", 
                // ya que un día de vacación fue reemplazado por un día festivo. 
                // El empleado simplemente regresa más tarde. 
                // No se necesita reembolsar saldo al historial a menos que cambie "cantidadDiasSolicitados".
                
                // Enviar correo de notificación
                try {
                    const infoEmpleado = await getSolicitudesByIdSolcitudDao(sol.idSolicitud, sol.idEmpleado);
                    if (infoEmpleado && infoEmpleado.correoInstitucional) {
                        const emailHtml = `
                        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; border: 1px solid #e0e0e0; padding: 30px;">
                                <h2 style="color: #1976d2; margin-top: 0; text-align: center; border-bottom: 2px solid #e3f2fd; padding-bottom: 15px;">Actualización de Fechas de Vacaciones</h2>
                                <p>Estimado(a) <strong>${infoEmpleado.nombreCompleto}</strong>,</p>
                                <p>Le notificamos que el sistema ha detectado la creación de un nuevo día festivo (<strong>${nuevoFestivoData.nombreDiaFestivo}</strong> el ${dayjs(nuevoFestivoData.fechaDiaFestivo).format('DD/MM/YYYY')}) que coincide con su período de vacaciones aprobado.</p>
                                <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; border-radius: 4px; margin: 20px 0;">
                                    <h4 style="margin: 0 0 10px 0; color: #2e7d32;">Nuevas Fechas Calculadas:</h4>
                                    <p style="margin: 5px 0;"><strong>Fecha Fin de Vacaciones:</strong> ${dayjs(fechaFin).format('DD/MM/YYYY')}</p>
                                    <p style="margin: 5px 0; color: #1976d2;"><strong>Nueva Fecha de Retorno a Labores:</strong> ${dayjs(proximaFechaLaboral).format('DD/MM/YYYY')}</p>
                                </div>
                                <p style="font-size: 14px; color: #555;">La cantidad de días descontados de su historial no fue alterada, únicamente se extendió su fecha de retorno para gozar del día festivo oficial.</p>
                                <p style="font-size: 14px; color: #d32f2f; font-weight: bold;">Importante: volver a firmar el formulario y presentarlo a la unidad correspondiente.</p>
                                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                                <p style="font-size: 12px; color: #999; text-align: center; margin-bottom: 0;">Este es un mensaje automático del Sistema de Control de Vacaciones, por favor no responda a este correo.</p>
                            </div>
                        </div>
                        `;

                        await transporter.sendMail({
                            from: `"Sistema de Vacaciones" <${FROM_EMAIL}>`,
                            to: infoEmpleado.correoInstitucional,
                            subject: "Actualización de Fechas - Vacaciones - no-reply",
                            html: emailHtml
                        });
                        console.log(`Correo enviado a ${infoEmpleado.correoInstitucional} por ajuste de fechas en solicitud ${sol.idSolicitud}`);
                    }
                } catch (emailError) {
                    console.error(`Error al enviar notificación por recálculo (Solicitud ${sol.idSolicitud}):`, emailError);
                }
            }
        }
        
        console.log("=== FIN RECALCULO POR NUEVO FESTIVO ===");
    } catch (error) {
        console.error("Error en recalcularSolicitudesPorNuevoFestivo:", error);
    }
};
