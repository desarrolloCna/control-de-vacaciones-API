import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
  const query = `
    DROP VIEW IF EXISTS HistorialVacaciones;
  `;
  await client.execute(query);
  
  const queryCreate = `
    CREATE VIEW HistorialVacaciones AS 
      WITH HistorialConAcumulado AS (
          SELECT 
              historial_vacaciones.idHistorial AS idHistorial,
              historial_vacaciones.idSolicitud AS idSolicitudOriginal,
              COALESCE(historial_vacaciones.idSolicitud, ROW_NUMBER() OVER (PARTITION BY historial_vacaciones.idEmpleado ORDER BY historial_vacaciones.idHistorial)) AS idSolicitudCorrelativo,
              historial_vacaciones.idEmpleado AS idEmpleado,
              historial_vacaciones.periodo AS periodo,
              COALESCE(historial_vacaciones.diasAcreditados, '') AS diasAcreditados,
              (CASE 
                  WHEN ((historial_vacaciones.tipoRegistro = 1) AND (historial_vacaciones.diasSolicitados IS NULL)) THEN '' 
                  ELSE historial_vacaciones.diasSolicitados 
              END) AS diasSolicitados,
              historial_vacaciones.fechaActualizacion AS fechaActualizacion,
              COALESCE(NULLIF(historial_vacaciones.fechaAcreditacion, ''), historial_vacaciones.fechaActualizacion) AS fechaAcreditacion,
              historial_vacaciones.tipoRegistro AS tipoRegistro,
              SUM(COALESCE(historial_vacaciones.diasAcreditados, 0)) OVER (PARTITION BY historial_vacaciones.idEmpleado, historial_vacaciones.periodo ORDER BY historial_vacaciones.idHistorial) AS totalDiasAcreditados,
              SUM(COALESCE(historial_vacaciones.diasDebitados, 0)) OVER (PARTITION BY historial_vacaciones.idEmpleado, historial_vacaciones.periodo ORDER BY historial_vacaciones.idHistorial) AS totalDiasDebitados
          FROM historial_vacaciones 
          WHERE (historial_vacaciones.estado = 'A')
      ), 
      HistorialFinal AS (
          SELECT 
              HistorialConAcumulado.idHistorial AS idHistorial,
              HistorialConAcumulado.idSolicitudOriginal AS idSolicitudOriginal,
              HistorialConAcumulado.idSolicitudCorrelativo AS idSolicitudCorrelativo,
              HistorialConAcumulado.idEmpleado AS idEmpleado,
              HistorialConAcumulado.periodo AS periodo,
              HistorialConAcumulado.diasAcreditados AS diasAcreditados,
              HistorialConAcumulado.diasSolicitados AS diasSolicitados,
              (CASE 
                  WHEN (HistorialConAcumulado.tipoRegistro = 1) THEN '' 
                  ELSE HistorialConAcumulado.fechaActualizacion 
              END) AS fechaDebito,
              HistorialConAcumulado.fechaAcreditacion AS fechaAcreditacion,
              HistorialConAcumulado.tipoRegistro AS tipoRegistro,
              HistorialConAcumulado.totalDiasAcreditados AS totalDiasAcreditados,
              HistorialConAcumulado.totalDiasDebitados AS totalDiasDebitados
          FROM HistorialConAcumulado
      )
      SELECT 
          HistorialFinal.idHistorial AS idHistorial,
          HistorialFinal.idSolicitudOriginal AS idSolicitudOriginal,
          HistorialFinal.idSolicitudCorrelativo AS idSolicitudCorrelativo,
          HistorialFinal.idEmpleado AS idEmpleado,
          HistorialFinal.periodo AS periodo,
          HistorialFinal.diasAcreditados AS diasAcreditados,
          HistorialFinal.diasSolicitados AS diasSolicitados,
          HistorialFinal.fechaDebito AS fechaDebito,
          HistorialFinal.fechaAcreditacion AS fechaAcreditacion,
          HistorialFinal.tipoRegistro AS tipoRegistro,
          HistorialFinal.totalDiasAcreditados AS totalDiasAcreditados,
          HistorialFinal.totalDiasDebitados AS totalDiasDebitados,
          (HistorialFinal.totalDiasAcreditados - HistorialFinal.totalDiasDebitados) AS diasDisponiblesTotales
      FROM HistorialFinal 
      ORDER BY HistorialFinal.idHistorial, HistorialFinal.periodo;
  `;
  
  await client.execute(queryCreate);
  console.log("View updated successfully");
}

run().catch(console.error);
