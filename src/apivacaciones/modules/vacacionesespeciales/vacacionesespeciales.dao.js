import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import { registrarBitacoraDao } from "../../dao/bitacora/bitacora.dao.js";

export const registrarVacacionesEspecialesDao = async (data) => {
    try {
        const queryInsert = `
            INSERT INTO vacaciones_especiales (idEmpleado, idInfoPersonal, 
            idUsuario, flagAutorizacion, descripcion, fechaInicioValidez, fechaFinValidez, fechaIngresoGestion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const result = await Connection.execute(queryInsert, [
            data.idEmpleado,
            data.idInfoPersonal,
            data.idUsuario,
            data.flagAutorizacion,
            data.descripcion,
            data.fechaInicioValidez,
            data.fechaFinValidez,
            data.fechaIngresoGestion,
        ]);

        // Log bitácora
        await registrarBitacoraDao({
            idUsuario: data.idUsuario || 1, 
            usuario: data.usuarioSession || "Admin", 
            accion: 'INSERT',
            tabla: 'vacaciones_especiales',
            idRegistroAfectado: Number(result.lastInsertRowid),
            detallesAnteriores: null,
            detallesNuevos: {
               idEmpleado: data.idEmpleado,
               descripcion: data.descripcion,
               fechaInicio: data.fechaInicioValidez,
               fechaFin: data.fechaFinValidez
            },
            descripcion: `Se habilitó un beneficio de vacaciones adelantadas para el empleado ID: ${data.idEmpleado}`
        });

        // En SQLite usamos lastInsertRowid en lugar de insertId
        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en registrarVacacionesEspecialesDao:", error);
        throw error;
    }
}

export const consultarGestionVacacionesEspecialesDao = async (idEmpleado, fechaEnCurso) => {    
    try{

        const query = `SELECT count(*) as isExist
                        FROM vacaciones_especiales
                        WHERE idEmpleado = ?
                        AND estado = 'A'
                        AND date(?) BETWEEN fechaInicioValidez AND fechaFinValidez
                        AND flagAutorizacion = 1;`

        const result = await Connection.execute(query, [idEmpleado, fechaEnCurso]);

        return result.rows[0];

    }catch(error){
        console.log("Error en consultarGestionVacacionesEspecialesDao:", error);
        throw error;
    }
}

export const registrarExcepcionLimiteDao = async (data) => {
    try {
        await Connection.execute(`
            CREATE TABLE IF NOT EXISTS excepciones_limite_vacaciones (
                idExcepcion INTEGER PRIMARY KEY AUTOINCREMENT,
                idEmpleado INTEGER NOT NULL,
                idInfoPersonal INTEGER NOT NULL,
                idUsuario INTEGER NOT NULL,
                estado VARCHAR(1) DEFAULT 'A',
                flagAutorizacion INTEGER DEFAULT 0,
                descripcion TEXT,
                fechaInicioValidez DATE,
                fechaFinValidez DATE,
                fechaIngresoGestion DATETIME
            );
        `);

        const queryInsert = `
            INSERT INTO excepciones_limite_vacaciones (idEmpleado, idInfoPersonal, 
            idUsuario, flagAutorizacion, descripcion, fechaInicioValidez, fechaFinValidez, fechaIngresoGestion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const result = await Connection.execute(queryInsert, [
            data.idEmpleado,
            data.idInfoPersonal,
            data.idUsuario,
            data.flagAutorizacion,
            data.descripcion,
            data.fechaInicioValidez,
            data.fechaFinValidez,
            data.fechaIngresoGestion,
        ]);

        // Log bitácora
        await registrarBitacoraDao({
            idUsuario: data.idUsuario || 1, 
            usuario: data.usuarioSession || "Admin", 
            accion: 'INSERT',
            tabla: 'excepciones_limite_vacaciones',
            idRegistroAfectado: Number(result.lastInsertRowid),
            detallesAnteriores: null,
            detallesNuevos: {
               idEmpleado: data.idEmpleado,
               descripcion: data.descripcion,
               fechaInicio: data.fechaInicioValidez,
               fechaFin: data.fechaFinValidez
            },
            descripcion: `Se habilitó una excepción al límite de 20 días de vacaciones para el empleado ID: ${data.idEmpleado}`
        });

        return Number(result.lastInsertRowid);
    } catch (error) {
        console.log("Error en registrarExcepcionLimiteDao:", error);
        throw error;
    }
}

export const consultarExcepcionLimiteDao = async (idEmpleado, fechaEnCurso) => {    
    try{
        const query = `SELECT count(*) as isExist
                        FROM excepciones_limite_vacaciones
                        WHERE idEmpleado = ?
                        AND estado = 'A'
                        AND date(?) BETWEEN fechaInicioValidez AND fechaFinValidez
                        AND flagAutorizacion = 1;`

        const result = await Connection.execute(query, [idEmpleado, fechaEnCurso]);
        return result.rows[0];

    }catch(error){
        if (error.message && error.message.includes("no such table")) {
           return { isExist: 0 };
        }
        console.log("Error en consultarExcepcionLimiteDao:", error);
        throw error;
    }
}
