import { createPool } from "mysql2/promise";

import "dotenv/config";

// Configuración del pool de conexiones
const pool = createPool({
    host: process.env.DB_MYSQL_HOST,
    user: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    port: process.env.DB_MYSQL_PORT,
    database: process.env.DB_MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mantenemos los mismos nombres de funciones para no romper tu código existente
export const OpenConection = async () => {
    const connection = await pool.getConnection();
    return connection;
};

export const CloseConection = async (connection) => {
    if (connection) {
        await connection.release();
    }
};

// Función adicional útil para consultas simples
export const query = async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
};
