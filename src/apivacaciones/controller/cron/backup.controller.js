import { Connection as ConnectionAPI } from "../../dao/connection/conexionsqlite.dao.js";
import { Connection as ConnectionCatalogos } from "../../../catalogosapi/dao/conexionb/conexioncatsqlite.js";
import { transporter, FROM_EMAIL } from "../../services/email/transporter.js";
import dayjs from "dayjs";

export const backupDatabaseController = async (req, res) => {
    try {
        console.log("Iniciando proceso de backup de bases de datos...");

        // 1. Respaldar DB Principal (Empleados, Solicitudes, etc.)
        const apiTablesRes = await ConnectionAPI.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
        const apiTables = apiTablesRes.rows.map(row => row.name);
        
        const backupDataAPI = {};
        for (const table of apiTables) {
            const result = await ConnectionAPI.execute(`SELECT * FROM ${table}`);
            backupDataAPI[table] = result.rows;
        }

        // 2. Respaldar DB Catálogos
        const catalogTablesRes = await ConnectionCatalogos.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
        const catalogTables = catalogTablesRes.rows.map(row => row.name);
        
        const backupDataCatalogos = {};
        for (const table of catalogTables) {
            const result = await ConnectionCatalogos.execute(`SELECT * FROM ${table}`);
            backupDataCatalogos[table] = result.rows;
        }

        // 3. Serializar
        const jsonBackupAPI = JSON.stringify(backupDataAPI, null, 2);
        const jsonBackupCatalogos = JSON.stringify(backupDataCatalogos, null, 2);
        const fechaStr = dayjs().format("YYYY-MM-DD");

        // 4. Configurar correo
        const mailOptions = {
            from: FROM_EMAIL,
            to: "gestionesrrhhiga@gmail.com",
            subject: `📦 Copia de Seguridad Sistema de Vacaciones - ${fechaStr}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #1A237E;">Copia de Seguridad Automática</h2>
                    <p>Adjunto encontrarás las copias de seguridad de las bases de datos de Turso generadas el <strong>${dayjs().format("DD/MM/YYYY HH:mm")}</strong>.</p>
                    <ul>
                        <li><strong>DB Principal:</strong> ${apiTables.length} tablas exportadas.</li>
                        <li><strong>DB Catálogos:</strong> ${catalogTables.length} tablas exportadas.</li>
                    </ul>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">
                        Este mensaje fue generado automáticamente por el sistema de control de vacaciones.
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: `backup_api_${fechaStr}.json`,
                    content: jsonBackupAPI,
                    contentType: 'application/json'
                },
                {
                    filename: `backup_catalogos_${fechaStr}.json`,
                    content: jsonBackupCatalogos,
                    contentType: 'application/json'
                }
            ]
        };

        // 5. Enviar correo
        await transporter.sendMail(mailOptions);
        console.log("Copia de seguridad enviada exitosamente por correo.");

        res.status(200).json({ message: "Copia de seguridad generada y enviada correctamente." });
    } catch (error) {
        console.error("Error al generar copia de seguridad:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
