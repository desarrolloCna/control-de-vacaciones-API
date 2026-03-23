import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import { calcularAniosPasados, formatDateToDisplay } from "../utils/dateutils.js";
import dayjs from "dayjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateVacationRequestPDF = async (employeeData, diasPorPeriodo) => {

  const aniosAntiguedad = calcularAniosPasados(employeeData.fechaIngreso);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'LETTER'
    });
    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", err => reject(err));

    // Configuración de colores y estilo
    const primaryColor = "#4F46E5"; 
    const secondaryColor = "#444444";
    const lightGray = "#f8f9fa";
    const numeroBoleta = employeeData.correlativo || `CNA-URRHH-${employeeData.idSolicitud}`;

    /* =====================================================
       ENCABEZADO E IMAGEN
    ===================================================== */
    const logoPath = path.join(__dirname, "..", "..", "..", "assets", "image.png");
    try {
      doc.image(logoPath, 50, 45, { width: 50 });
    } catch (err) {
      console.warn("Logo no encontrado:", err.message);
    }

    // Títulos Institucionales
    doc.font("Helvetica-Bold").fontSize(14).fillColor(primaryColor)
      .text("CONSEJO NACIONAL DE ADOPCIONES", 0, 50, { align: "center", width: doc.page.width });
    
    doc.fontSize(11).fillColor(secondaryColor)
      .text("UNIDAD DE RECURSOS HUMANOS", 0, 68, { align: "center", width: doc.page.width });

    doc.fontSize(12).fillColor(primaryColor)
      .text(`BOLETA DE SOLICITUD DE VACACIONES No. ${numeroBoleta}`, 0, 95, { align: "center", width: doc.page.width });

    // Línea decorativa del encabezado
    doc.moveTo(50, 115).lineTo(562, 115).lineWidth(1.5).strokeColor(primaryColor).stroke();

    /* =====================================================
       FECHA Y PRESENTACIÓN
    ===================================================== */
    doc.fillColor("#000000").font("Helvetica").fontSize(10)
      .text(`Guatemala, ${formatDateToDisplay(employeeData.fechaSolicitud)}`, 50, 125, { align: "right", width: 512 });

    /* =====================================================
       SECCIÓN: DATOS DEL TRABAJADOR
    ===================================================== */
    let currentY = 150;
    
    // Título de sección con fondo
    doc.rect(50, currentY, 512, 18).fill(primaryColor);
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10).text("DATOS DEL TRABAJADOR", 60, currentY + 4);
    
    currentY += 25;
    
    // Recuadro de datos
    doc.rect(50, currentY, 512, 95).fillColor(lightGray).fill();
    doc.rect(50, currentY, 512, 95).strokeColor("#dddddd").lineWidth(0.5).stroke();
    
    doc.fillColor("#000000").fontSize(10);
    const drawRow = (label, value, x, y, width) => {
        doc.font("Helvetica-Bold").text(label, x, y, { continued: true });
        doc.font("Helvetica").text(value || "—", { width: width });
    };

    drawRow("Nombre Completo: ", employeeData.nombreCompleto, 70, currentY + 10, 400);
    drawRow("Puesto Actual: ", employeeData.puesto, 70, currentY + 25, 400);
    drawRow("Ubicación Funcional: ", employeeData.unidadSolicitud, 70, currentY + 40, 450);
    drawRow("Renglón Presupuestario: ", employeeData.renglon, 70, currentY + 55, 150);
    
    // Segunda columna interna
    drawRow("Fecha de Ingreso: ", formatDateToDisplay(employeeData.fechaIngreso), 330, currentY + 55, 150);
    drawRow("Años de Antigüedad: ", aniosAntiguedad.toString(), 70, currentY + 70, 150);

    currentY += 115;

    /* =====================================================
       SECCIÓN: DETALLE DE LA SOLICITUD
    ===================================================== */
    currentY += 15; // Más espacio
    doc.font("Helvetica").fontSize(11).fillColor("#333333")
      .text(
        "De conformidad con el artículo 50 del Reglamento de Trabajo Interno y Gestión del Recurso Humano del Consejo Nacional de Adopciones, de manera atenta solicito el goce de mis vacaciones por un período de ",
        50, currentY, { width: 512, align: 'justify', continued: true }
      )
      .font("Helvetica-Bold").fillColor(primaryColor)
      .text(`${employeeData.cantidadDiasSolicitados} días:`);

    currentY = doc.y + 15;

    // Caja de Fechas
    doc.rect(50, currentY, 512, 50).fillColor("#f0f4f8").fill();
    doc.rect(50, currentY, 512, 50).strokeColor(primaryColor).lineWidth(1).stroke();

    const dateY = currentY + 15;
    doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(9);
    doc.text("INICIO DE VACACIONES", 65, dateY, { width: 150, align: "center" });
    doc.text("FIN DE VACACIONES", 230, dateY, { width: 150, align: "center" });
    doc.text("REINCORPORACIÓN", 395, dateY, { width: 150, align: "center" });

    doc.fillColor("#000000").font("Helvetica").fontSize(11);
    doc.text(formatDateToDisplay(employeeData.fechaInicioVacaciones), 65, dateY + 12, { width: 150, align: "center" });
    doc.text(formatDateToDisplay(employeeData.fechaFinVacaciones), 230, dateY + 12, { width: 150, align: "center" });
    doc.text(formatDateToDisplay(employeeData.fechaRetornoLabores), 395, dateY + 12, { width: 150, align: "center" });

    currentY += 100; // Más espacio antes de periodos

    /* =====================================================
       DETALLE DE PERÍODOS
    ===================================================== */
    doc.font("Helvetica").fontSize(11).fillColor("#000000").text("Los días solicitados corresponden a los siguientes períodos:", 50, currentY);
    currentY += 18;

    diasPorPeriodo.forEach((periodo) => {
      doc.font("Helvetica").fontSize(9).fillColor("#000000")
        .text("• ", 70, currentY, { continued: true })
        .font("Helvetica-Bold").text(`01/01/${periodo.periodo} al 31/12/${periodo.periodo}`, { continued: true })
        .font("Helvetica").text(`: se tomarán ${periodo.diasTomados} días, quedando ${periodo.diasDisponibles} días disponibles.`);
      currentY += 14;
    });

    currentY += 30; // Más espacio antes de justificación

    /* =====================================================
       JUSTIFICACIÓN
    ===================================================== */
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#444")
      .text("JUSTIFICACIÓN:", 50, currentY);
    currentY += 14;

    doc.font("Helvetica-Oblique").fontSize(9).fillColor("#777")
      .text("(Llenar este campo si la fecha del formulario es menor a diez (10) días de la fecha de inicio, según lo establecido en la circular CNA-URRHH-022-2025, REPROGRAMACIÓN DEL PLAN DE VACACIONES)", 50, currentY, { width: 512 });
    
    currentY = doc.y + 8;
    doc.rect(50, currentY, 512, 65).strokeColor("#cccccc").lineWidth(0.5).stroke();

    currentY += 125; // Más espacio antes de firmas

    /* =====================================================
       SECCIÓN DE FIRMAS
    ===================================================== */
    const colWidth = 220;
    const col1X = 60;
    const col2X = 330;

    // Líneas
    doc.moveTo(col1X, currentY).lineTo(col1X + colWidth, currentY).strokeColor("#000").lineWidth(1).stroke();
    doc.moveTo(col2X, currentY).lineTo(col2X + colWidth, currentY).stroke();

    currentY += 8;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#000");
    doc.text(employeeData.nombreCompleto, col1X, currentY, { width: colWidth, align: "center" });
    doc.text(employeeData.nombreCoordinador || "PENDIENTE DE AUTORIZACIÓN", col2X, currentY, { width: colWidth, align: "center" });

    currentY += 12;
    doc.font("Helvetica").fontSize(8).fillColor("#666");
    doc.text(employeeData.puesto, col1X, currentY, { width: colWidth, align: "center" });
    doc.text(employeeData.puestoCoordinador || "COORDINACIÓN / SUBDIRECCIÓN", col2X, currentY, { width: colWidth, align: "center" });

    /* =====================================================
       FOOTER INSTITUCIONAL
    ===================================================== */
    const footerY = 720;
    doc.moveTo(50, footerY).lineTo(562, footerY).lineWidth(0.5).strokeColor("#eeeeee").stroke();
    
    doc.fillColor("#999").fontSize(8).font("Helvetica-Oblique")
      .text("Este formulario debe ser impreso, firmado y entregado en las Unidad de Recursos Humanos, antes del día que el trabajador inicie su periodo vacacional.", 0, footerY + 10, { align: "center", width: doc.page.width });
    
    doc.end();
  });
};
