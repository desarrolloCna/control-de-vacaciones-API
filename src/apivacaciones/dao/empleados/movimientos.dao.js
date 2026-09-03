import { Connection } from "../connection/conexionsqlite.dao.js";

export const registrarSucesionPuestoDao = async (idEmpleado, puestoAnterior, puestoNuevo, fechaIngresoPuestoAnterior, fechaIngresoPuestoNuevo, motivo) => {
    try {
        const query = `
            INSERT INTO historial_puestos 
            (idEmpleado, puestoAnterior, puestoNuevo, fechaIngresoPuestoAnterior, fechaIngresoPuestoNuevo, motivo)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await Connection.execute(query, [idEmpleado, puestoAnterior, puestoNuevo, fechaIngresoPuestoAnterior, fechaIngresoPuestoNuevo, motivo]);
        return { message: "Sucesión de puesto registrada correctamente." };
    } catch (error) {
        console.error("Error en registrarSucesionPuestoDao:", error);
        throw error;
    }
};

export const darBajaEmpleadoDao = async (idEmpleado, fechaBaja, motivoBaja) => {
    try {
        // Actualiza el empleado a inactivo
        const queryEmpleado = `
            UPDATE empleados 
            SET estado = 'I', fechaBaja = ?, motivoBaja = ?
            WHERE idEmpleado = ?;
        `;
        await Connection.execute(queryEmpleado, [fechaBaja, motivoBaja, idEmpleado]);

        // Desactiva el usuario asociado (si lo tiene)
        const queryUsuario = `
            UPDATE usuarios 
            SET estadoUsuario = 'I', estado = 'I'
            WHERE idEmpleado = ?;
        `;
        await Connection.execute(queryUsuario, [idEmpleado]);

        return { message: "Empleado dado de baja correctamente." };
    } catch (error) {
        console.error("Error en darBajaEmpleadoDao:", error);
        throw error;
    }
};

export const actualizarPuestoEmpleadoDao = async (idEmpleado, puestoNuevo, fechaIngresoPuestoNuevo) => {
    try {
        const query = `
            UPDATE empleados 
            SET puesto = ?, fechaIngresoPuesto = ?
            WHERE idEmpleado = ?;
        `;
        await Connection.execute(query, [puestoNuevo, fechaIngresoPuestoNuevo, idEmpleado]);
        return { message: "Puesto de empleado actualizado." };
    } catch (error) {
        console.error("Error en actualizarPuestoEmpleadoDao:", error);
        throw error;
    }
};
