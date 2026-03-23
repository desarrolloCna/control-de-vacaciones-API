import { Connection } from '../connection/conexionsqlite.dao.js';

export const BitacoraRestaurarDao = {
    // Restaurar un cambio basado en la bitácora
    restaurarRegistro: async (idBitacora) => {
        // 1. Obtener el registro de la bitácora
        const bitRes = await Connection.execute("SELECT * FROM bitacora_cambios WHERE idBitacora = ?", [idBitacora]);
        if (bitRes.rows.length === 0) throw new Error("Registro de bitácora no encontrado");

        const entry = bitRes.rows[0];
        const tabla = entry.tabla;
        const idRegistro = entry.idRegistro;
        const datosAnteriores = JSON.parse(entry.datosAnteriores);

        if (!datosAnteriores) throw new Error("No hay datos anteriores para restaurar");

        // 2. Mapear tabla a su llave primaria (PK)
        const pkMap = {
            'empleados': 'idEmpleado',
            'infoPersonalEmpleados': 'idInfoPersonal',
            'dpiEmpleados': 'idDpi',
            'solicitudes_vacaciones': 'idSolicitud',
            'suspensiones': 'idSuspension',
            'dias_festivos': 'idDiasFestivos',
            'usuarios': 'idUsuario'
        };

        const pkName = pkMap[tabla];
        if (!pkName) throw new Error(`Mapeo de llave primaria no definido para la tabla: ${tabla}`);

        // 3. Construir consulta (INSERT si fue DELETE, UPDATE si fue UPDATE/INSERT)
        const keys = Object.keys(datosAnteriores);
        let query = "";
        let values = [];

        if (entry.accion === 'DELETE') {
            const columns = keys.join(', ');
            const placeholders = keys.map(() => '?').join(', ');
            query = `INSERT INTO ${tabla} (${columns}) VALUES (${placeholders})`;
            values = keys.map(k => datosAnteriores[k]);
        } else {
            const setClause = keys.map(k => `${k} = ?`).join(', ');
            query = `UPDATE ${tabla} SET ${setClause} WHERE ${pkName} = ?`;
            values = keys.map(k => datosAnteriores[k]);
            values.push(idRegistro);
        }
        
        const result = await Connection.execute(query, values);
        return { result, entry };
    }
};
