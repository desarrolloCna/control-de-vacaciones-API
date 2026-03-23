import { Connection } from "../Connection/ConexionSqlite.dao.js";

export const actualizarDatosLaboralesDao = async (idEmpleado, data) => {
    try {
        const query = `
            UPDATE empleados 
            SET puesto = ?, salario = ?, fechaIngreso = ?, correoInstitucional = ?, 
                extensionTelefonica = ?, unidad = ?, renglon = ?, observaciones = ?, 
                coordinacion = ?, tipoContrato = ?, numeroCuentaCHN = ?, 
                numeroContrato = ?, numeroActa = ?, numeroAcuerdo = ?,
                isCoordinador = ?
            WHERE idInfoPersonal = ?;
        `;

        await Connection.execute(query, [
            data.puesto,
            data.salario,
            data.fechaIngreso,
            data.correoInstitucional,
            data.extensionTelefonica,
            data.unidad,
            data.renglon,
            data.observaciones,
            data.coordinacion,
            data.tipoContrato,
            data.numeroCuentaCHN,
            data.numeroContrato,
            data.numeroActa,
            data.numeroAcuerdo,
            data.isCoordinador,
            idEmpleado
        ]);

        return { message: "Datos laborales actualizados correctamente" };
    } catch (error) {
        console.log("Error en actualizarDatosLaboralesDao:", error);
        throw error;
    }
};

export const actualizarInfoPersonalDao = async (idInfoPersonal, data) => {
    try {
        const query = `
            UPDATE infoPersonalEmpleados 
            SET primerNombre = ?, segundoNombre = ?, tercerNombre = ?, 
                primerApellido = ?, segundoApellido = ?, apellidoCasada = ?, 
                numeroCelular = ?, correoPersonal = ?, direccionResidencia = ?, 
                estadoCivil = ?, Genero = ?, departamentoNacimiento = ?, 
                municipioNacimiento = ?, nit = ?, numAfiliacionIgss = ?, 
                fechaNacimiento = ?, numeroLicencia = ?, tipoLicencia = ?
            WHERE idInfoPersonal = ?;
        `;

        await Connection.execute(query, [
            data.primerNombre,
            data.segundoNombre,
            data.tercerNombre,
            data.primerApellido,
            data.segundoApellido,
            data.apellidoCasada,
            data.numeroCelular,
            data.correoPersonal,
            data.direccionResidencia,
            data.estadoCivil,
            data.genero,
            data.departamentoNacimiento,
            data.municipioNacimiento,
            data.nit,
            data.numAfiliacionIgss,
            data.fechaNacimiento,
            data.numeroLicencia,
            data.tipoLicencia,
            idInfoPersonal
        ]);

        return { message: "Información personal actualizada correctamente" };
    } catch (error) {
        console.log("Error en actualizarInfoPersonalDao:", error);
        throw error;
    }
};

export const actualizarNivelEducativoDao = async (idInfoPersonal, data) => {
    try {
        const query = `
            UPDATE nivelEducativo 
            SET nivelDeEstudios = ?, ultimoNivelAlcanzado = ?, 
                añoUltimoNivelCursado = ?, Profesion = ?, 
                numeroColegiado = ?, fechaColegiacion = ?
            WHERE idInfoPersonal = ?;
        `;

        await Connection.execute(query, [
            data.nivelDeEstudios,
            data.ultimoNivelAlcanzado,
            data.añoUltimoNivelCursado,
            data.Profesion,
            data.numeroColegiado,
            data.fechaColegiacion,
            idInfoPersonal
        ]);

        return { message: "Nivel educativo actualizado correctamente" };
    } catch (error) {
        console.log("Error en actualizarNivelEducativoDao:", error);
        throw error;
    }
};

export const actualizarPertenenciaSoLiDao = async (idInfoPersonal, data) => {
    try {
        const query = `
            UPDATE pertenenciaSociolinguistica 
            SET etnia = ?, comunidadLinguistica = ?
            WHERE idInfoPersonal = ?;
        `;

        await Connection.execute(query, [
            data.etnia,
            data.comunidadLinguistica,
            idInfoPersonal
        ]);

        return { message: "Pertenencia sociolingüística actualizada correctamente" };
    } catch (error) {
        console.log("Error en actualizarPertenenciaSoLiDao:", error);
        throw error;
    }
};

export const actualizarDatosMedicosDao = async (idInfoPersonal, data) => {
    try {
        const query = `
            UPDATE datosMedicos 
            SET discapacidad = ?, tipoDiscapacidad = ?, 
                tipoSangre = ?, condicionMedica = ?, 
                tomaMedicina = ?, nombreMedicamento = ?, 
                sufreAlergia = ?
            WHERE idInfoPersonal = ?;
        `;

        await Connection.execute(query, [
            data.discapacidad,
            data.tipoDiscapacidad,
            data.tipoSangre,
            data.condicionMedica,
            data.tomaMedicina,
            data.nombreMedicamento,
            data.sufreAlergia,
            idInfoPersonal
        ]);

        return { message: "Datos médicos actualizados correctamente" };
    } catch (error) {
        console.log("Error en actualizarDatosMedicosDao:", error);
        throw error;
    }
};
export const actualizarInfoDpiDao = async (idInfoPersonal, data) => {
    try {
        const query = `
            UPDATE dpiEmpleados 
            SET numeroDocumento = ?, departamentoExpedicion = ?, 
                municipioExpedicion = ?, fechaVencimientoDpi = ?
            WHERE idDpi = (SELECT idDpi FROM infoPersonalEmpleados WHERE idInfoPersonal = ?);
        `;

        await Connection.execute(query, [
            data.numeroDocumento,
            data.departamentoExpedicion,
            data.municipioExpedicion,
            data.fechaVencimientoDpi,
            idInfoPersonal
        ]);

        return { message: "Información del DPI actualizada correctamente" };
    } catch (error) {
        console.log("Error en actualizarInfoDpiDao:", error);
        throw error;
    }
};

export const obtenerEmpleadoPorInfoPersonalDao = async (idInfoPersonal) => {
    try {
        const query = `
            SELECT e.idEmpleado, e.unidad, e.correoInstitucional,
                   (ip.primerNombre || ' ' || COALESCE(ip.segundoNombre || ' ', '') || ip.primerApellido || ' ' || COALESCE(ip.segundoApellido, '')) as nombreCompleto
            FROM empleados e
            JOIN infoPersonalEmpleados ip ON e.idInfoPersonal = ip.idInfoPersonal
            WHERE e.idInfoPersonal = ?;
        `;
        const result = await Connection.execute(query, [idInfoPersonal]);
        return result.rows[0];
    } catch (error) {
        console.log("Error en obtenerEmpleadoPorInfoPersonalDao:", error);
        throw error;
    }
};
