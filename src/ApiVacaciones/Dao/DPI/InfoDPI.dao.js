import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const IngresarInformacionDpiDao = async (data) => {
    try {
        // Verificar si el documento ya existe
        const existingResult = await Connection.execute(
            "SELECT numeroDocumento FROM dpiEmpleados WHERE numeroDocumento = ? AND estado = 'A';", 
            [data.numeroDocumento]
        );
        
        if (existingResult.rows.length === 1) {
            throw {
                codRes: 409,
                message: "NUMERO DOCUMENTO INGRESADO YA EXISTE" 
            };
        } else {
            // Insertar nuevo documento
            const result = await Connection.execute(
                "INSERT INTO dpiEmpleados (numeroDocumento, departamentoExpedicion, municipioExpedicion, fechaVencimientoDpi) VALUES (?, ?, ?, ?);", 
                [data.numeroDocumento, data.departamentoExpedicion, data.municipioExpedicion, data.fechaVencimientoDpi]
            );
            
            return Number(result.lastInsertRowid);
        }
    } catch (error) {
        console.log("Error en IngresarInformacionDpiDao:", error);
        throw error;
    }
};

export const ConsultarDpiDao = async (numeroDocumento) => {
    try {
        const result = await Connection.execute(
            "SELECT idDpi, numeroDocumento, departamentoExpedicion, municipioExpedicion, fechaVencimientoDpi, estado FROM dpiEmpleados WHERE numeroDocumento = ? AND estado = 'A';", 
            [numeroDocumento]
        );
       
        if (result.rows.length === 0) {
            throw {
                codeError: 101,
                message: "No se encontro el DPI consultado"
            };
        }
        return result.rows; 
    } catch (error) {
        console.log("Error en ConsultarDpiDao:", error);
        throw error;
    }
};