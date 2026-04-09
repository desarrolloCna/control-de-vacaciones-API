import exceljs from 'exceljs';
import { getDatosEmpleadosSaldosDao, getDatosSolicitudesMesDao } from '../../dao/reports/exportarexcel.dao.js';
import dayjs from 'dayjs';

export const generarExcelEmpleadosSaldosService = async (unidad = null) => {
    try {
        const datos = await getDatosEmpleadosSaldosDao(unidad);

        const workbook = new exceljs.Workbook();
        workbook.creator = 'Sistema de Vacaciones CNA';
        workbook.created = new Date();

        const sheet = workbook.addWorksheet('Saldos de Empleados', {
            views: [{ state: 'frozen', ySplit: 4 }]
        });

        // 1. Título institucional
        sheet.mergeCells('A1:G2');
        const titleCell = sheet.getCell('A1');
        const unidadTitleText = unidad ? `\nUnidad: ${unidad}` : '';
        titleCell.value = `CONSEJO NACIONAL DE ADOPCIONES - CNA \nReporte de Saldos de Vacaciones Pendientes${unidadTitleText}`;
        titleCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF003366' } // Un azul institucional
        };

        // Timestamp de creación
        sheet.mergeCells('A3:G3');
        const dateCell = sheet.getCell('A3');
        dateCell.value = `Generado el: ${dayjs().format('DD/MM/YYYY HH:mm')}`;
        dateCell.alignment = { horizontal: 'right' };
        dateCell.font = { italic: true };

        // 2. Encabezados
        const headers = ['ID', 'DPI', 'Nombre Completo', 'Puesto', 'Unidad', 'Fecha Ingreso', 'Saldo Disponible (Días)'];
        sheet.addRow(headers);
        const headerRow = sheet.getRow(4);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } }; // Verde Institucional
            cell.alignment = { horizontal: 'center' };
            cell.border = {
                top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}
            };
        });

        // 3. Anchura de columnas
        sheet.columns = [
            { width: 10 },  // ID
            { width: 18 },  // DPI
            { width: 40 },  // Nombre
            { width: 35 },  // Puesto
            { width: 25 },  // Unidad
            { width: 15 },  // Fecha
            { width: 25 }   // Saldo
        ];

        // 4. Agregar data
        datos.forEach((row, index) => {
            const dataRow = sheet.addRow([
                row.idEmpleado,
                row.DPI,
                row.nombreCompleto,
                row.puesto,
                row.unidad,
                row.fechaIngreso,
                row.saldoDisponible
            ]);

            // Formato alternado y bordes
            dataRow.eachCell((cell, colNumber) => {
                cell.border = {
                    top: {style:'thin', color: {argb: 'FFEEEEEE'}},
                    left: {style:'thin', color: {argb: 'FFEEEEEE'}},
                    bottom: {style:'thin', color: {argb: 'FFEEEEEE'}},
                    right: {style:'thin', color: {argb: 'FFEEEEEE'}}
                };
                if (index % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFA' } };
                }
                if (colNumber === 7) {
                    cell.font = { bold: true }; // Saldo en negrita
                    cell.alignment = { horizontal: 'center' };
                    if (row.saldoDisponible > 40) {
                        cell.font = { bold: true, color: { argb: 'FFD32F2F' } }; // Rojo si tiene mucho
                    }
                }
                if (colNumber === 6) {
                    cell.alignment = { horizontal: 'center' };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    } catch (error) {
        console.error("Error en generarExcelEmpleadosSaldosService:", error);
        throw error;
    }
};

export const generarExcelSolicitudesMesService = async (unidad = null) => {
    try {
        const datos = await getDatosSolicitudesMesDao(unidad);

        const workbook = new exceljs.Workbook();
        workbook.creator = 'Sistema de Vacaciones CNA';
        
        const sheet = workbook.addWorksheet('Solicitudes del Mes', {
            views: [{ state: 'frozen', ySplit: 4 }]
        });

        sheet.mergeCells('A1:G2');
        const titleCell = sheet.getCell('A1');
        const unidadTitleText = unidad ? `\nUnidad: ${unidad}` : '';
        titleCell.value = `CONSEJO NACIONAL DE ADOPCIONES - CNA \nReporte de Solicitudes de Vacaciones (Mes Actual)${unidadTitleText}`;
        titleCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };

        sheet.mergeCells('A3:G3');
        sheet.getCell('A3').value = `Mes: ${dayjs().format('MMMM YYYY')} - Generado: ${dayjs().format('DD/MM/YYYY')}`;
        sheet.getCell('A3').alignment = { horizontal: 'right' };
        sheet.getCell('A3').font = { italic: true };

        const headers = ['Correlativo', 'Empleado', 'Unidad', 'Estado', 'Fechas', 'Días', 'F. Solicitud'];
        sheet.addRow(headers);
        const headerRow = sheet.getRow(4);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } }; // Verde Institucional
            cell.alignment = { horizontal: 'center' };
            cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
        });

        sheet.columns = [
            { width: 15 }, { width: 35 }, { width: 25 }, { width: 15 }, { width: 28 }, { width: 10 }, { width: 15 }
        ];

        datos.forEach((row, index) => {
            const dataRow = sheet.addRow([
                row.correlativo || 'N/A',
                row.nombreEmpleado,
                row.unidad,
                row.estadoSolicitud,
                `${row.fechaInicioVacaciones} al ${row.fechaFinVacaciones}`,
                row.cantidadDiasSolicitados,
                row.fechaSolicitud
            ]);

            dataRow.eachCell((cell, colNumber) => {
                cell.border = { bottom: {style:'thin', color: {argb: 'FFEEEEEE'}} };
                if (colNumber === 4) {
                    const est = (row.estadoSolicitud || '').toLowerCase();
                    if (est === 'autorizadas') cell.font = { color: { argb: 'FF2E7D32' }, bold: true };
                    else if (est === 'rechazadas') cell.font = { color: { argb: 'FFC62828' }, bold: true };
                    else cell.font = { color: { argb: 'FFF57C00' }, bold: true };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    } catch (error) {
        console.error("Error en generarExcelSolicitudesMesService:", error);
        throw error;
    }
};
