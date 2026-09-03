import { Connection } from "../connection/conexionsqlite.dao.js";

export const IngresarSolicitudDao = async (data) => {
    try {
        // Ejecutamos la inserción con subconsultas para garantizar atomicidad 
        // y evitar duplicidad de correlativos en solicitudes concurrentes exactas.
        const result = await Connection.execute(`
            INSERT INTO solicitudes_vacaciones (
                idEmpleado, idInfoPersonal, idCoordinador, 
                unidadSolicitud, fechaInicioVacaciones, fechaFinVacaciones, 
                fechaRetornoLabores, cantidadDiasSolicitados, 
                numeroCorrelativo, correlativo, fechaSolicitud
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, 
                NULL, 
                'Pendiente de Autorización', 
                CURRENT_TIMESTAMP
            );
        `, 
            [data.idEmpleado,
             data.idInfoPersonal,
             data.idCoordinador,
             data.unidadSolicitud, 
             data.fechaInicioVacaciones,
             data.fechaFinVacaciones,
             data.fechaRetornoLabores,
             data.cantidadDiasSolicitados
            ]);

        const insertId = Number(result.lastInsertRowid);
        
        // Obtener el correlativo generado para la bitácora
        const resInserted = await Connection.execute(
            `SELECT correlativo FROM solicitudes_vacaciones WHERE idSolicitud = ?`, 
            [insertId]
        );
        const correlativoInicial = resInserted.rows.length > 0 ? resInserted.rows[0].correlativo : 'SDVC-?';

        // Registrar en Bitácora
        if (data.idUsuarioSession && result.rowsAffected > 0) {
            const { registrarBitacoraDao } = await import("../bitacora/bitacora.dao.js");
            await registrarBitacoraDao({
                idUsuario: data.idUsuarioSession,
                usuario: data.usuarioSession || "Empleado",
                accion: 'INSERT',
                tabla: 'solicitudes_vacaciones',
                idRegistro: Number(result.lastInsertRowid),
                datosAnteriores: null,
                datosNuevos: {
                    idEmpleado: data.idEmpleado,
                    correlativo: correlativoInicial,
                    fechaInicio: data.fechaInicioVacaciones,
                    fechaFin: data.fechaFinVacaciones,
                    diasSolicitados: data.cantidadDiasSolicitados,
                    estado: 'enviada'
                },
                descripcion: `El usuario ${data.usuarioSession || 'Empleado'} ingresó una nueva solicitud de vacaciones (${correlativoInicial}) por ${data.cantidadDiasSolicitados} días.`
            });
        }

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en IngresarSolicitudDao:", error);
        throw error;
    }
};

export const eliminarSolicitudDao = async (idSolicitud) => {
    try {
        const result = await Connection.execute(`UPDATE solicitudes_vacaciones SET estado = 'N'
                                                 WHERE idSolicitud = ?`, 
            [idSolicitud]);
        return result.rowsAffected;
    } catch (error) {
        console.log("Error en eliminarSolicitudDao:", error);
        throw error;
    }
};

export const actualizarEstadoSolicitudDao = async (data) => {
    try {
        let query = `UPDATE solicitudes_vacaciones SET estadoSolicitud = ?`;
        let params = [data.estadoSolicitud];

        // Lógica de Correlativo Oficial al autorizar
        if (data.estadoSolicitud === 'autorizadas') {
            query += `, 
            numeroCorrelativo = COALESCE(numeroCorrelativo, (SELECT COALESCE(MAX(numeroCorrelativo), 0) + 1 FROM solicitudes_vacaciones WHERE strftime('%Y', fechaSolicitud) = strftime('%Y', CURRENT_TIMESTAMP))),
            correlativo = COALESCE(
                CASE WHEN numeroCorrelativo IS NOT NULL THEN correlativo ELSE NULL END, 
                'CNA-SDVC-' || (SELECT COALESCE(MAX(numeroCorrelativo), 0) + 1 FROM solicitudes_vacaciones WHERE strftime('%Y', fechaSolicitud) = strftime('%Y', CURRENT_TIMESTAMP)) || '-' || strftime('%Y', CURRENT_TIMESTAMP)
            )`;
        }

        if (data.firmaCoordinador) {
            query += `, firma_coordinador = ?`;
            params.push(data.firmaCoordinador);
        }
        if (data.firmaRrhh) {
            query += `, firma_rrhh = ?`;
            params.push(data.firmaRrhh);
        }
        if (data.observacionesRrhh) {
            query += `, observaciones_rrhh = ?`;
            params.push(data.observacionesRrhh);
        }

        query += ` WHERE idSolicitud = ? AND idEmpleado = ?;`;
        params.push(data.idSolicitud, data.idEmpleado);

        // 2. Obtener datos antes del cambio para la bitácora
        const solRes = await Connection.execute("SELECT * FROM solicitudes_vacaciones WHERE idSolicitud = ?", [data.idSolicitud]);
        const datosAnteriores = solRes.rows[0];

        const result = await Connection.execute(query, params);

        // 3. Registrar en Bitácora si se proporcionó información de sesión
        if (data.idUsuarioSession && result.rowsAffected > 0) {
            const { registrarBitacoraDao } = await import("../bitacora/bitacora.dao.js");
            await registrarBitacoraDao({
                idUsuario: data.idUsuarioSession,
                usuario: data.usuarioSession,
                accion: 'UPDATE',
                tabla: 'solicitudes_vacaciones',
                idRegistro: data.idSolicitud,
                datosAnteriores: datosAnteriores,
                datosNuevos: { ...datosAnteriores, estadoSolicitud: data.estadoSolicitud },
                descripcion: `Cambio de estado en solicitud ${datosAnteriores.correlativo} a '${data.estadoSolicitud}'.`
            });
        }

        return result.rowsAffected;
    } catch (error) {
        console.log("Error en actualizarEstadoSolicitudDao:", error);
        throw error;
    }
};

export const bloquearSolicitudParaDebitoDao = async (idSolicitud, idEmpleado) => {
    try {
        const query = `UPDATE solicitudes_vacaciones 
                       SET estadoSolicitud = 'procesando_debito' 
                       WHERE idSolicitud = ? AND idEmpleado = ? AND estadoSolicitud = 'autorizadas'`;
        const result = await Connection.execute(query, [idSolicitud, idEmpleado]);
        return result.rowsAffected;
    } catch (error) {
        console.log("Error en bloquearSolicitudParaDebitoDao:", error);
        throw error;
    }
};
