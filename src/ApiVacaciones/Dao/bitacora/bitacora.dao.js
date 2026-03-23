import { Connection } from "../connection/conexionsqlite.dao.js";

export const registrarBitacoraDao = async (data) => {
    try {
        const result = await Connection.execute(
            `INSERT INTO bitacora_cambios (idUsuario, usuario, accion, tabla, idRegistro, datosAnteriores, datosNuevos, descripcion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.idUsuario,
                data.usuario,
                data.accion,
                data.tabla,
                data.idRegistro || null,
                data.datosAnteriores ? JSON.stringify(data.datosAnteriores) : null,
                data.datosNuevos ? JSON.stringify(data.datosNuevos) : null,
                data.descripcion
            ]
        );
        return result;
    } catch (error) {
        console.log("Error en registrarBitacoraDao:", error);
        throw error;
    }
};

export const obtenerBitacoraDao = async (filtros = {}) => {
    try {
        let query = `SELECT * FROM bitacora_cambios WHERE 1=1`;
        const params = [];

        if (filtros.fechaInicio) {
            query += ` AND fechaHora >= ?`;
            params.push(filtros.fechaInicio);
        }
        if (filtros.fechaFin) {
            query += ` AND fechaHora <= ?`;
            params.push(filtros.fechaFin + " 23:59:59");
        }
        if (filtros.usuario) {
            query += ` AND usuario LIKE ?`;
            params.push(`%${filtros.usuario}%`);
        }
        if (filtros.tabla) {
            query += ` AND tabla = ?`;
            params.push(filtros.tabla);
        }
        if (filtros.accion) {
            query += ` AND accion = ?`;
            params.push(filtros.accion);
        }

        query += ` ORDER BY fechaHora DESC LIMIT 200`;

        const result = await Connection.execute(query, params);
        return result.rows;
    } catch (error) {
        console.log("Error en obtenerBitacoraDao:", error);
        throw error;
    }
};
