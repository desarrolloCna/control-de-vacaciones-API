import PDFDocument from 'pdfkit';

export const generarPDFEjecutivoService = async (datosDashboard) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // HEADER --
            doc.fillColor('#1E293B')
               .fontSize(20)
               .text('Consejo Nacional de Adopciones', { align: 'center' });
            
            doc.moveDown(0.2);
            doc.fontSize(14)
               .fillColor('#4F46E5')
               .text('Reporte Ejecutivo de Vacaciones', { align: 'center' });
            
            doc.moveDown(0.5);
            doc.fontSize(10)
               .fillColor('#64748B')
               .text(`Fecha de generación: ${new Date().toLocaleDateString('es-GT')}`, { align: 'center' });

            doc.moveDown(2);

            // KPIs --
            const kpis = datosDashboard.kpis || {};
            doc.fillColor('#1E293B').fontSize(14).text('1. Indicadores Generales (KPIs)', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#334155');
            doc.text(`• Total Empleados Activos: ${kpis.totalEmpleados || 0}`);
            doc.text(`• Solicitudes Registradas (General): ${kpis.totalGlobal || 0}`);
            doc.text(`• Tasa de Aprobación Historica: ${parseFloat(kpis.tasaAprobacion || 0).toFixed(1)}%`);
            doc.text(`• Promedio de días por solicitud: ${kpis.promedioDias || 0}`);
            doc.moveDown(2);

            // ESTADOS --
            const distribucion = datosDashboard.distribucionEstados || {};
            doc.fillColor('#1E293B').fontSize(14).text('2. Distribución de Estados', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#334155');
            Object.keys(distribucion).forEach(key => {
                if(distribucion[key] > 0) {
                    doc.text(`• ${key.toUpperCase()}: ${distribucion[key]}`);
                }
            });
            doc.moveDown(2);

            // SOLICITUDES RECIENTES --
            const recientes = datosDashboard.solicitudesRecientes || [];
            doc.fillColor('#1E293B').fontSize(14).text('3. Solicitudes Recientes', { underline: true });
            doc.moveDown(1);
            
            const tableTop = doc.y;
            const itemMargin = 20;

            doc.fontSize(10).fillColor('#4F46E5');
            doc.text('CORRELATIVO', 50, tableTop, { width: 90 });
            doc.text('EMPLEADO', 140, tableTop, { width: 160 });
            doc.text('ESTADO', 300, tableTop, { width: 90 });
            doc.text('DÍAS', 390, tableTop, { width: 50 });
            doc.text('INICIO', 440, tableTop, { width: 80 });

            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#E2E8F0').stroke();
            
            let currentY = tableTop + 25;
            doc.fontSize(9).fillColor('#334155');
            
            recientes.slice(0, 15).forEach((sol, i) => {
                if (currentY > 750) {
                    doc.addPage();
                    currentY = 50;
                }
                
                doc.text(sol.correlativo || `SOL-${sol.idSolicitud}`, 50, currentY, { width: 90 });
                doc.text(sol.nombreEmpleado || 'N/A', 140, currentY, { width: 160 });
                doc.text((sol.estadoSolicitud || '').toUpperCase(), 300, currentY, { width: 90 });
                doc.text(String(sol.cantidadDiasSolicitados || 0), 390, currentY, { width: 50 });
                
                const fecha = sol.fechaInicioVacaciones ? new Date(sol.fechaInicioVacaciones).toLocaleDateString('es-GT') : '--';
                doc.text(fecha, 440, currentY, { width: 80 });
                
                currentY += itemMargin;
            });

            // NUMERACIÓN DE PÁGINAS --
            const pages = doc.bufferedPageRange();
            for (let i = 0; i < pages.count; i++) {
                doc.switchToPage(i);
                doc.fontSize(8).fillColor('#94A3B8').text(
                    `Página ${i + 1} de ${pages.count} - Sistema RRHH CNA`,
                    50,
                    800,
                    { align: 'center', width: 500 }
                );
            }

            doc.end();

        } catch (error) {
            console.error("Error al generar PDF con pdfkit:", error);
            reject(error);
        }
    });
};
