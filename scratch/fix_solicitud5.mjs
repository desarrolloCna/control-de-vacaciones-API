import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.DB_TURSO_URL,
  authToken: process.env.DB_TURSO_AUTH_TOKEN,
});

async function fix() {
  // Check if solicitud 5 already has a log record
  const existing = await client.execute("SELECT * FROM historial_vacaciones WHERE idSolicitud = 5");
  console.log("=== Registros existentes para solicitud 5 ===");
  existing.rows.forEach(r => console.log(JSON.stringify(r)));

  if (existing.rows.length === 0) {
    // Insert the cancellation log record
    // Employee 79, periodo 2025, diasDisponibles = 9 (current)
    const insertLog = `INSERT INTO historial_vacaciones 
        (idEmpleado, idInfoPersonal, idSolicitud, periodo, diasAcreditados, diasDebitados, diasDisponibles, fechaActualizacion, tipoRegistro) 
        VALUES (79, 79, 5, 2025, 0, 0, 9, '2026-08-25 10:24:04', 1)`;
    await client.execute(insertLog);
    console.log("\n=> Registro de cancelación insertado para solicitud 5.");
  } else {
    console.log("\n=> Ya existe registro, no se inserta.");
  }

  // Verify
  const hist = await client.execute("SELECT idHistorial, idSolicitud, periodo, diasAcreditados, diasDebitados, diasDisponibles, tipoRegistro FROM historial_vacaciones WHERE idEmpleado = 79 ORDER BY idHistorial ASC");
  console.log("\n=== HISTORIAL FINAL ===");
  hist.rows.forEach(r => console.log(r));

  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
