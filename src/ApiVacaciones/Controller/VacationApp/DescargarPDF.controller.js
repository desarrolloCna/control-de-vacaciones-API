import { getSolicitudesByIdSolcitudDao } from "../../dao/vacationapp/getsolicitudbyid.dao.js";
import { consultarPeriodosYDiasPorEmpeladoDao } from "../../dao/vacationapp/historialvacaciones/consultashistorial.dao.js";
import { consultarCoordinadorService } from "../../services/coordinadores/coordinadores.service.js";
import { generateVacationRequestPDF } from "../../services/pdfgenerator/pdfgenerator.service.js";
import { obtenerPeriodosParaVacaciones } from "../../services/vacationapp/hisotrialvacaciones/calculodedias.service.js";
import { Connection } from "../../dao/connection/conexionsqlite.dao.js";

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
        const solicitudCompleta = { ...solicitud, ...coordinador, firmaCoordinador };

        // 5. Obtener los periodos para el cálculo impreso en el PDF
        console.log("DESC PDF - Paso 5: Periodos");
        const periodos = await consultarPeriodosYDiasPorEmpeladoDao(idEmpleado);
        const diasPorPeriodo = obtenerPeriodosParaVacaciones(periodos, solicitud.cantidadDiasSolicitados);

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
