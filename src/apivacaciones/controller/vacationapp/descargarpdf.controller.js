import { getSolicitudesByIdSolcitudDao, consultarDiasEnTransitoDao } from "../../dao/vacationapp/getsolicitudbyid.dao.js";
import { consultarPeriodosYDiasPorEmpeladoDao, consultarDebitosPorSolicitudDao } from "../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import { consultarCoordinadorService } from "../../services/coordinadores/coordinadores.service.js";
import { generateVacationRequestPDF } from "../../services/pdfgenerator/pdfgenerator.service.js";
import { obtenerPeriodosParaVacaciones, restarDiasEnTransito } from "../../services/vacationapp/hisotrialvacaciones/calculodedias.service.js";
import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import dayjs from "dayjs";
import { consultarGestionVacacionesEspecialesDao } from "../../modules/vacacionesespeciales/vacacionesespeciales.dao.js";

export const descargarPDFController = async (req, res) => {
    try {
        const { idSolicitud, idEmpleado } = req.params;

        // 1. Obtener la solicitud básica
        console.log("DESC PDF - Paso 1: Solicitud ", idSolicitud, idEmpleado);
        const solicitud = await getSolicitudesByIdSolcitudDao(idSolicitud, idEmpleado);

        // 2. Obtener el coordinador
        console.log("DESC PDF - Paso 2: Coordinador ", solicitud.idCoordinador);
        const coordinador = await consultarCoordinadorService(solicitud.idCoordinador);

        // 3. Obtener la firma del coordinador
        console.log("DESC PDF - Paso 3: Firma");
        const queryFirma = `SELECT firma_coordinador FROM solicitudes_vacaciones WHERE idSolicitud = ?`;
        const resultFirma = await Connection.execute(queryFirma, [idSolicitud]);
        const firmaCoordinador = resultFirma.rows.length > 0 ? resultFirma.rows[0].firma_coordinador : null;

        // 4. Armar el objeto completo simulando lo que recibe PDFGenerator
        console.log("DESC PDF - Paso 4: Armado de Obj completo");
        
        // Fetch current dias disponibles
        const queryDias = `SELECT diasDisponibles FROM historial_vacaciones WHERE idEmpleado = ? ORDER BY idHistorial DESC LIMIT 1`;
        const resultDias = await Connection.execute(queryDias, [idEmpleado]);
        const diasDisponiblesActuales = resultDias.rows.length > 0 ? resultDias.rows[0].diasDisponibles : 0;
        
        // Check if there was a partial cancellation (tipoRegistro = 1 for this solicitud)
        const queryDevueltos = `SELECT SUM(diasAcreditados) AS devueltos FROM historial_vacaciones WHERE idSolicitud = ? AND tipoRegistro = 1`;
        const resultDevueltos = await Connection.execute(queryDevueltos, [idSolicitud]);
        let diasDevueltosCancelacion = resultDevueltos.rows.length > 0 && resultDevueltos.rows[0].devueltos ? Number(resultDevueltos.rows[0].devueltos) : 0;
        let originalDevueltos = diasDevueltosCancelacion;

        // Si el usuario solicita explícitamente el PDF normal, ignoramos los días devueltos para generar la boleta normal (la actualizada)
        if (req.query.tipo === 'normal' || req.query.tipo === 'actualizado') {
            diasDevueltosCancelacion = 0;
            if (solicitud.estadoSolicitud === 'cancelada') {
                solicitud.estadoSolicitud = 'autorizadas';
            }
        } else if (req.query.tipo === 'original') {
            // Si el usuario solicita el PDF original que fue anulado, sumamos los devueltos para tener el total original
            solicitud.cantidadDiasSolicitados = solicitud.cantidadDiasSolicitados + diasDevueltosCancelacion;
            diasDevueltosCancelacion = 0; // Se resetea para que la vista sea normal
            solicitud.isOriginalAnulado = true;
            if (solicitud.estadoSolicitud === 'cancelada') {
                solicitud.estadoSolicitud = 'autorizadas'; // Lo pasamos a autorizadas para que imprima boleta normal (pero con el flag de anulado)
            }
        }

        const solicitudCompleta = { ...solicitud, ...coordinador, firmaCoordinador, diasDisponiblesActuales, diasDevueltosCancelacion };

        // 5. Obtener los periodos para el cálculo impreso en el PDF
        console.log("DESC PDF - Paso 5: Periodos");
        let diasPorPeriodo = await consultarDebitosPorSolicitudDao(idSolicitud);
        
        // Si el usuario quiere el PDF normal actualizado, y hubo una devolución parcial,
        // ajustamos los débitos históricos restando los días devueltos.
        const needsRecalculation = (req.query.tipo === 'normal' || req.query.tipo === 'actualizado') && originalDevueltos > 0;

        if (diasPorPeriodo && needsRecalculation) {
            console.log("DESC PDF - Ajustando periodos por devolucion parcial...");
            let diasADevolver = originalDevueltos;
            let adjusted = [];
            
            // Devolvemos los días empezando por los periodos más recientes afectados
            for (let i = diasPorPeriodo.length - 1; i >= 0; i--) {
                let p = diasPorPeriodo[i];
                let takeBack = Math.min(p.diasTomados, diasADevolver);
                
                p.diasTomados -= takeBack;
                p.diasDisponibles += takeBack;
                diasADevolver -= takeBack;
                
                if (p.diasTomados > 0) {
                    adjusted.unshift(p);
                }
            }
            diasPorPeriodo = adjusted;
        } else if (!diasPorPeriodo) {
            console.log("DESC PDF - Calculando periodos al vuelo...");
            const anioActual = dayjs().year();
            const fechaActual = dayjs().format("YYYY-MM-DD");
            let excluirAnioActual = anioActual;
            
            const permiso = await consultarGestionVacacionesEspecialesDao(idEmpleado, fechaActual);
            if (permiso && permiso.isExist > 0) {
                excluirAnioActual = null;
            }
            
            let periodos = await consultarPeriodosYDiasPorEmpeladoDao(idEmpleado, excluirAnioActual);
            
            // Restar días en tránsito de solicitudes más antiguas
            const diasEnTransito = await consultarDiasEnTransitoDao(idEmpleado, idSolicitud);
            if (diasEnTransito > 0) {
                console.log("Quemando dias en transito: ", diasEnTransito);
                periodos = restarDiasEnTransito(periodos, diasEnTransito);
            }
            
            diasPorPeriodo = obtenerPeriodosParaVacaciones(periodos, solicitud.cantidadDiasSolicitados);
        } else {
            console.log("DESC PDF - Usando historial de débitos exacto.");
        }

        // 6. Construir el Binario del PDF en memoria
        console.log("DESC PDF - Paso 6: Construccion binaria de PDF");
        const bufferPDF = await generateVacationRequestPDF(solicitudCompleta, diasPorPeriodo);

        // 7. Configurar Headers para visualizar en el navegador o guardar
        console.log("DESC PDF - Paso 7: Despachando binario...");
        const fileName = solicitud.estadoSolicitud === 'autorizadas' 
            ? `Solicitud_Autorizada_${idSolicitud}.pdf` 
            : `Solicitud_Vacaciones_Pendiente_${idSolicitud}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        
        // 8. Enviar el stream al cliente
        res.status(200).send(bufferPDF);

    } catch (error) {
        console.error("================ ERROR AL FORJAR PDF ================");
        console.error(error);
        console.error(error.message);
        console.error(error.stack);
        console.error("=====================================================");
        res.status(500).json({ error: error.message || "Error al generar el documento", stack: error.stack });
    }
};
