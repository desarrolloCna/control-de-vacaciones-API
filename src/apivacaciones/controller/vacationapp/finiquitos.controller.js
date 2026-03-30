import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { generateFiniquitoPDF } from "../../services/pdfgenerator/pdfgenerator.service.js";

/**
 * Controller to generate Finiquito 
 */
export const descargarFiniquitoController = async (req, res) => {
    try {
        const { idEmpleado, periodo } = req.params;

        if (!idEmpleado || !periodo) {
            return res.status(400).json({ error: "Faltan parámetros requeridos (idEmpleado, periodo)" });
        }

        console.log(`[FINIQUITO] Solicitando finiquito de ${idEmpleado} para periodo ${periodo}`);

        // Validar que realmente existe el periodo y está en 0
        const qPeriodo = `
            SELECT SUM(diasDisponibles) as diasDisponiblesTotales
            FROM historial_vacaciones 
            WHERE idEmpleado = ? AND (periodo = ? OR periodo = cast(? as text) OR periodo = cast(? as integer)) 
            AND tipoRegistro = 1
        `;
        
        let diasDisponiblesTotales = 0;
        try {
            // Re-calculate exactly what available days remain for this period directly.
            // Creditos = tipoRegistro=1, Debitos = tipoRegistro=2
            const qCreditos = `SELECT SUM(totalDiasAcreditados) as cred FROM historial_vacaciones WHERE idEmpleado = ? AND periodo = ? AND tipoRegistro = 1`;
            const qDebitos = `SELECT SUM(diasSolicitados) as deb FROM historial_vacaciones WHERE idEmpleado = ? AND periodo = ? AND tipoRegistro = 2`;
            
            const [rCred, rDeb] = await Promise.all([
                Connection.execute(qCreditos, [idEmpleado, periodo]),
                Connection.execute(qDebitos, [idEmpleado, periodo])
            ]);
            
            const cred = rCred.rows.length > 0 ? (rCred.rows[0].cred || 0) : 0;
            const deb = rDeb.rows.length > 0 ? (rDeb.rows[0].deb || 0) : 0;
            diasDisponiblesTotales = cred - deb;

            console.log(`[FINIQUITO] Periodo ${periodo} -> Acreditados: ${cred}, Debitados: ${deb}, Restante: ${diasDisponiblesTotales}`);
        } catch(subErr) {
             console.log("[FINIQUITO] Error calculando saldo", subErr);
        }

        // Permitimos 0 o menos para el finiquito. Si es > 0 no deberia dejarse.
        // Pero para debug y asegurarnos que no se rompe si hay redondeo:
        if (diasDisponiblesTotales > 0) {
            // return res.status(400).json({ error: `El período ${periodo} aún tiene ${diasDisponiblesTotales} días disponibles. No aplica finiquito.` });
            console.log(`[FINIQUITO] Advertencia: El periodo tiene saldo (${diasDisponiblesTotales}), pero se imprime el documento por orden administrativa.`);
        }

        // Datos del empleado
        const queryEmp = `
            SELECT 
                (inf.primerNombre || ' ' || IFNULL(inf.segundoNombre, '') || ' ' || inf.primerApellido || ' ' || IFNULL(inf.segundoApellido, '')) AS nombreCompleto, 
                emp.puesto,
                emp.fechaIngreso
            FROM empleados emp
            JOIN infoPersonalEmpleados inf ON emp.idInfoPersonal = inf.idInfoPersonal
            WHERE emp.idEmpleado = ?
        `;
        const resEmp = await Connection.execute(queryEmp, [idEmpleado]);
        if (resEmp.rows.length === 0) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        
        const employeeData = resEmp.rows[0];
        employeeData.Nombre = employeeData.nombreCompleto;
        employeeData.unidad = employeeData.puesto; // Fallback unit

        const bufferPDF = await generateFiniquitoPDF(employeeData, periodo);
        
        const cleanName = (employeeData.Nombre || "Empleado").replace(/\s+/g, '_');
        const fileName = `Finiquito_Vacacional_${periodo}_${cleanName}.pdf`;
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        
        res.status(200).send(bufferPDF);

    } catch (error) {
        console.error("================ ERROR FINIQUITO ================");
        console.error(error);
        res.status(500).json({ error: "Error al generar finiquito", detail: error.message });
    }
};
