import { actualizarPuestoEmpleadoDao, darBajaEmpleadoDao, registrarSucesionPuestoDao } from "../../dao/empleados/movimientos.dao.js";
import { obtenerDatosLaboralesDao } from "../../dao/empleados/getdataempleados.dao.js";

export const procesarSucesionPuestoService = async (idEmpleado, idInfoPersonal, puestoNuevo, fechaIngresoPuestoNuevo, motivo) => {
    // 1. Obtener datos actuales del empleado para guardarlos en el historial
    const datosActuales = await obtenerDatosLaboralesDao(idInfoPersonal);
    if (!datosActuales) {
        throw new Error("No se encontraron los datos actuales del empleado.");
    }

    const puestoAnterior = datosActuales.puesto;
    // Si no tenía fechaIngresoPuesto (sistema antiguo), usamos fechaIngreso
    const fechaIngresoPuestoAnterior = datosActuales.fechaIngresoPuesto || datosActuales.fechaIngreso;

    // 2. Registrar en el historial de puestos
    await registrarSucesionPuestoDao(
        idEmpleado, 
        puestoAnterior, 
        puestoNuevo, 
        fechaIngresoPuestoAnterior, 
        fechaIngresoPuestoNuevo, 
        motivo
    );

    // 3. Actualizar el puesto en la tabla empleados
    await actualizarPuestoEmpleadoDao(idEmpleado, puestoNuevo, fechaIngresoPuestoNuevo);

    return { message: "Sucesión de puesto procesada correctamente." };
};

export const procesarBajaEmpleadoService = async (idEmpleado, fechaBaja, motivoBaja) => {
    // La baja simplemente desactiva al usuario y al empleado,
    // y guarda la fecha y motivo.
    await darBajaEmpleadoDao(idEmpleado, fechaBaja, motivoBaja);
    return { message: "Empleado dado de baja exitosamente." };
};
