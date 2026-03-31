/**
 * Configuración centralizada de branding para PDFs institucionales.
 * Todos los generadores de PDF (boletas, finiquitos, reportes) deben
 * consumir estos valores en lugar de hardcodear colores o textos.
 */

// Colores institucionales del CNA
export const PDF_COLORS = {
  primary:       "#4F46E5",   // Morado-azul institucional (encabezados, títulos)
  secondary:     "#444444",   // Gris oscuro (subtítulos)
  accent:        "#F5A623",   // Naranja/Ámbar institucional (líneas decorativas, chips)
  text:          "#333333",   // Texto principal del cuerpo
  textLight:     "#666666",   // Texto secundario / pies de firma
  textMuted:     "#999999",   // Texto de footer
  lightGray:     "#f8f9fa",   // Fondo de recuadros de datos
  border:        "#dddddd",   // Bordes de recuadros
  white:         "#ffffff",
  black:         "#000000",
};

// Textos institucionales
export const PDF_INSTITUTION = {
  name:          "CONSEJO NACIONAL DE ADOPCIONES",
  department:    "UNIDAD DE RECURSOS HUMANOS",
  footerBoleta:  "Este formulario debe ser impreso, firmado y entregado en las Unidad de Recursos Humanos, antes del día que el trabajador inicie su periodo vacacional.",
  footerFiniquito: "Presentar dicho finiquito a la Unidad de Recursos Humanos para su validación y sello correspondiente.",
  location:      "Guatemala",
};

// Fuentes (disponibles en PDFKit sin register)
export const PDF_FONTS = {
  bold:          "Helvetica-Bold",
  normal:        "Helvetica",
  italic:        "Helvetica-Oblique",
};

// Tamaños de fuente
export const PDF_SIZES = {
  title:         14,
  subtitle:      12,
  sectionHeader: 11,
  body:          11,
  label:         10,
  small:         9,
  footer:        8,
};
