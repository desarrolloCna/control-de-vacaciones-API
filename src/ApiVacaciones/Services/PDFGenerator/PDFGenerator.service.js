import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import { calcularAniosPasados, formatDateToDisplay } from "../Utils/DateUtils.js";
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

    // Obtener mes y año actuales con dayjs
    const currentMonth = dayjs().month() + 1; // dayjs().month() devuelve 0-11
    const currentYear = dayjs().year();
    const numeroBoleta = `CNA-URRHH-${employeeData.idSolicitud}`;

    /* =====================================================
       LOGO
    ===================================================== */
    const logoPath = path.join(__dirname, "..", "..", "..", "assets", "image.png");
    try {
      doc.image(logoPath, 50, 40, { width: 47, height: 42 });
    } catch (err) {
      console.warn("Logo no encontrado:", err.message);
    }

    /* =====================================================
       ENCABEZADO CENTRADO
    ===================================================== */
    doc.font("Helvetica-Bold").fontSize(12)
      .text("CONSEJO NACIONAL DE ADOPCIONES", 0, 50, { 
        align: "center",
        width: doc.page.width 
      });
    
    doc.font("Helvetica-Bold").fontSize(11)
      .text("UNIDAD RECURSOS HUMANOS", 0, 67, { 
        align: "center",
        width: doc.page.width 
      });

    /* =====================================================
       TÍTULO CENTRADO
    ===================================================== */
    doc.font("Helvetica-Bold").fontSize(11)
      .text(
        `BOLETA DE SOLICITUD DE VACACIONES No. ${numeroBoleta}`,
        0, 90,
        { 
          align: "center",
          width: doc.page.width 
        }
      );

    /* =====================================================
       FECHA
    ===================================================== */
    doc.font("Helvetica").fontSize(11)
      .text(
        `Guatemala, ${formatDateToDisplay(employeeData.fechaSolicitud)}`,
        50, 115,
        { align: "left" }
      );

    /* =====================================================
       DATOS DEL TRABAJADOR
    ===================================================== */
    const startY = 140;
    doc.font("Helvetica-Bold").fontSize(11)
      .text("Datos del trabajador:", 50, startY);

    let currentY = startY + 18;

    const addField = (label, value) => {
      doc.font("Helvetica-Bold").fontSize(11).text(label, 50, currentY, { continued: true });
      doc.font("Helvetica").text(value || "—");
      currentY += 16;
    };

    addField("Nombre completo: ", employeeData.nombreCompleto);
    addField("Puesto: ", employeeData.puesto);
    
    // Ubicación Funcional con manejo de texto largo
    doc.font("Helvetica-Bold").fontSize(11).text("Ubicación Funcional: ", 50, currentY, { continued: true });
    doc.font("Helvetica").text(employeeData.unidadSolicitud || "—", { width: 450 });
    currentY = doc.y + 2;
    
    addField("Renglón Presupuestario: ", employeeData.renglon);
    addField("Fecha de Ingreso: ", formatDateToDisplay(employeeData.fechaIngreso));
    addField("Años de Antigüedad: ", aniosAntiguedad.toString());

    currentY += 8;

    /* =====================================================
       TEXTO LEGAL
    ===================================================== */
    doc.font("Helvetica").fontSize(11)
      .text(
        "De conformidad con el artículo 50 del Reglamento de Trabajo Interno y Gestión del Recurso Humano del Consejo Nacional de Adopciones, de manera atenta solicito el goce de mis vacaciones, ",
        50, currentY,
        { 
          continued: true,
          width: 500,
          align: 'justify'
        }
      )
      .font("Helvetica-Bold")
      .text(`${employeeData.cantidadDiasSolicitados} días:`);

    currentY = doc.y + 12;

    /* =====================================================
       DETALLE
    ===================================================== */
    doc.font("Helvetica-Bold").fontSize(11).text("Detalle:", 50, currentY);
    currentY += 14;

    doc.font("Helvetica").fontSize(11);
    doc.text(`•   Inicio de vacaciones: ${formatDateToDisplay(employeeData.fechaInicioVacaciones)}`, 70, currentY);
    currentY += 14;
    doc.text(`•   Fin de vacaciones: ${formatDateToDisplay(employeeData.fechaFinVacaciones)}`, 70, currentY);
    currentY += 14;
    doc.text(`•   Reincorporación a laboral: ${formatDateToDisplay(employeeData.fechaRetornoLabores)}`, 70, currentY);
    currentY += 18;

    /* =====================================================
       PERÍODOS
    ===================================================== */
    doc.font("Helvetica").fontSize(11)
      .text("Los días solicitados corresponden a los siguientes períodos:", 50, currentY);
    currentY += 14;

    // Procesar cada período con espaciado optimizado
    diasPorPeriodo.forEach((periodo, index) => {
      doc.font("Helvetica").fontSize(11)
        .text(`•   `, 70, currentY, { continued: true })
        .font("Helvetica-Bold")
        .text(`01/01/${periodo.periodo} al 31/12/${periodo.periodo}`, { continued: true })
        .fillColor("#000000")
        .font("Helvetica")
        .text(`: se tomarán ${periodo.diasTomados} días, quedando ${periodo.diasDisponibles} días disponibles.`);
      
      // Espaciado entre períodos (más compacto)
      currentY += 13;
    });

    currentY += 12;

    /* =====================================================
       JUSTIFICACIÓN
    ===================================================== */
    doc.font("Helvetica-Bold").fontSize(11).text("JUSTIFICACIÓN", 50, currentY);
    currentY += 10;

    doc.font("Helvetica").fontSize(9)
      .text(
        "(Llenar este campo si la fecha del formulario es menor a diez (10) días de la fecha de inicio, según lo establecido en la circular CNA-URRHH-022-2025, REPROGRAMACIÓN DEL PLAN DE VACACIONES)",
        50, currentY,
        { width: 500 }
      );

    currentY = doc.y + 8;
    
    // Rectángulo para justificación
    doc.rect(50, currentY, 500, 50).stroke();

    currentY += 90;

    /* =====================================================
       FIRMAS - SIN CUADROS
    ===================================================== */
    const col1X = 80;
    const col2X = 350;

    // Líneas de firma
    doc.font("Helvetica").fontSize(10)
      .text("F.___________________________________", col1X, currentY);
    
    doc.text("F.___________________________________", col2X, currentY);

    currentY += 15;

    // Nombres y cargos - Columna 1
    doc.font("Helvetica-Bold").fontSize(9)
      .text(employeeData.nombreCompleto, col1X, currentY, { 
        width: 220,
        lineGap: 2
      });
    
    currentY += 11;
    
    doc.font("Helvetica").fontSize(9)
      .text(employeeData.puesto, col1X, currentY, { 
        width: 220,
        lineGap: 2
      });
    
    currentY += 11;

    // Nombres y cargos - Columna 2
    let col2Y = currentY - 22; // Volver al inicio para la segunda columna
    
    doc.font("Helvetica-Bold").fontSize(9)
      .text(employeeData.nombreCoordinador || "N/A", col2X, col2Y, { 
        width: 220,
        lineGap: 2
      })
    
    col2Y += 11;
    
    doc.font("Helvetica").fontSize(9)
      .text(employeeData.puestoCoordinador || "N/A", col2X, col2Y, { 
        width: 220,
        lineGap: 2
      });
    
    col2Y += 11;

    // Calcular la posición Y máxima entre ambas columnas y agregar espacio extra
    currentY = Math.max(currentY, col2Y) + 35;

    /* =====================================================
       CONDICIONES - CENTRADO
    ===================================================== */
    doc.font("Helvetica-Bold").fontSize(11)
      .text(
        "CONDICIONES DE ACEPTACIÓN EN LA UNIDAD DE RECURSOS HUMANOS", 
        0, 
        currentY, 
        {
          align: "center",
          width: doc.page.width
        }
      );

    currentY = doc.y + 10;

    doc.font("Helvetica-Oblique").fontSize(10)
      .text(
        "Este formulario debe ser impreso, firmado y entregado en las Unidad de Recursos Humanos, antes",
        0, 
        currentY,
        { 
          align: "center",
          width: doc.page.width
        }
      );

    currentY = doc.y + 2;

    doc.font("Helvetica-Oblique").fontSize(10)
      .text(
        "del día que el trabajador inicie su periodo vacacional.",
        0, 
        currentY,
        { 
          align: "center",
          width: doc.page.width
        }
      );

    /* =====================================================
       FINALIZAR PDF
    ===================================================== */
    doc.end();
  });
};